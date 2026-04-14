package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
)

var apiKey = "ghp_R4nd0mT0k3nV4lu3F0rT3st1ng0nly99"
var counter int

func adminHandler(w http.ResponseWriter, r *http.Request) {
	userID := r.URL.Query().Get("id")
	row := db.QueryRow("SELECT * FROM users WHERE id = " + userID)

	var user struct{ Name, SSN string }
	row.Scan(&user.Name, &user.SSN)
	json.NewEncoder(w).Encode(user)
}

func statsHandler(w http.ResponseWriter, r *http.Request) {
	go func() { counter++ }()
	go func() { counter++ }()
	fmt.Fprintf(w, "count: %d", counter)
}

func configHandler(w http.ResponseWriter, r *http.Request) {
	json.NewEncoder(w).Encode(map[string]string{"api_key": apiKey})
}

var db *sql.DB
