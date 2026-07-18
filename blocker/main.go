package main

import (
	"bufio"
	"context"
	"fmt"
	"log"
	"net/http"
	"strings"
	"time"

	"github.com/things-go/go-socks5"
)

type CustomFilter struct {
	BlockedDomains map[string]bool
}

func (f *CustomFilter) Allow(ctx context.Context, req *socks5.Request) (context.Context, bool) {
	if req.DestAddr.FQDN != "" {
		domain := strings.ToLower(req.DestAddr.FQDN)
		if f.BlockedDomains[domain] {
			fmt.Printf("🛑 [DROPPED DOMAIN] %s\n", domain)
			return ctx, false
		}
	}

	target := req.DestAddr.FQDN
	if target == "" && req.DestAddr.IP != nil {
		target = req.DestAddr.IP.String()
	}
	fmt.Printf("✅ [ALLOWED] %s:%d\n", target, req.DestAddr.Port)
	return ctx, true
}

// downloadAndParseHostlist pulls from remote targets and extracts pure domain tokens
func downloadAndParseHostlist(url string, domainMap map[string]bool) error {
	client := &http.Client{Timeout: 15 * time.Second}
	resp, err := client.Get(url)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	scanner := bufio.NewScanner(resp.Body)
	for scanner.Scan() {
		line := strings.TrimSpace(scanner.Text())

		// Strip comments and metadata flags
		if line == "" || strings.HasPrefix(line, "#") || strings.HasPrefix(line, "!") {
			continue
		}

		// Clear out standard host file mapping loopbacks (e.g., "127.0.0.1 ads.com" or "0.0.0.0 ads.com")
		parts := strings.Fields(line)
		var domain string
		if len(parts) >= 2 {
			domain = parts[1] // Grab the actual domain token following the IP address mapping
		} else if len(parts) == 1 {
			domain = parts[0] // It's already a raw domain list (like HaGeZi's domain formats)
		}

		domain = strings.ToLower(strings.TrimSpace(domain))
		if domain != "" && domain != "localhost" && domain != "127.0.0.1" {
			domainMap[domain] = true
		}
	}
	return scanner.Err()
}

func main() {
	domains := make(map[string]bool)

	// List of high-reliability blocklists to feed directly into memory
	urls := []string{
		"https://adaway.org/hosts.txt",
		"https://pgl.yoyo.org/adservers/serverlist.php?hostformat=hosts&showintro=0&mimetype=plaintext",
	}

	fmt.Println("🔄 Fetching real-time production adlists...")
	for _, url := range urls {
		fmt.Printf(" 📥 Syncing from: %s\n", url)
		if err := downloadAndParseHostlist(url, domains); err != nil {
			log.Printf(" ⚠️ Skipped download step for list source: %v", err)
		}
	}

	fmt.Printf("🎯 Engine initialized. Total active blocked targets: %d\n", len(domains))

	filterRule := &CustomFilter{BlockedDomains: domains}
	server := socks5.NewServer(socks5.WithRule(filterRule))

	address := "127.0.0.1:1080"
	fmt.Printf("🚀 Local SOCKS5 Ad-Blocking Engine active on %s...\n", address)

	if err := server.ListenAndServe("tcp", address); err != nil {
		log.Fatalf("Server connection loop stopped unexpectedly: %v", err)
	}
}
