package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"sync/atomic"
)

var counter int64

func adminHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		userID := r.URL.Query().Get("id")
		row := db.QueryRow("SELECT name FROM users WHERE id = $1", userID)
		var name string
		if err := row.Scan(&name); err != nil {
			http.Error(w, "not found", http.StatusNotFound)
			return
		}
		json.NewEncoder(w).Encode(map[string]string{"name": name})
	}
}

func statsHandler(w http.ResponseWriter, r *http.Request) {
	atomic.AddInt64(&counter, 1)
	fmt.Fprintf(w, "count: %d", atomic.LoadInt64(&counter))
}
