package main

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
)

// This function will set up the movies slice before tests run
func setup() {
	movies = []Movie{
		{ID: "1", Isbn: "438227", Title: "Luxembourg", Director: &Director{Firstname: "Antonio", Lastname: "Lukich"}},
		{ID: "2", Isbn: "832329", Title: "Shadows of Forgotten Ancestors", Director: &Director{Firstname: "Sergiy", Lastname: "Parajanov"}},
	}
}

func TestGetMovies(t *testing.T) {
	setup() // Initialize the movies slice

	// Create a new HTTP request to get movies
	req, err := http.NewRequest("GET", "/movies", nil)
	if err != nil {
		t.Fatal(err)
	}

	// Create a ResponseRecorder to record the response
	rr := httptest.NewRecorder()
	handler := http.HandlerFunc(getMovies)

	// Serve the HTTP request
	handler.ServeHTTP(rr, req)

	// Check the status code
	if status := rr.Code; status != http.StatusOK {
		t.Errorf("handler returned wrong status code: got %v want %v", status, http.StatusOK)
	}

	// Check the response body
	var moviesResponse []Movie
	err = json.Unmarshal(rr.Body.Bytes(), &moviesResponse)
	if err != nil {
		t.Fatal(err)
	}

	// Ensure we have the correct number of movies
	if len(moviesResponse) != 2 {
		t.Errorf("expected 2 movies, got %d", len(moviesResponse))
	}

	// Check if the movie titles are correct
	if moviesResponse[0].Title != "Luxembourg" {
		t.Errorf("expected title 'Luxembourg', got '%s'", moviesResponse[0].Title)
	}
	if moviesResponse[1].Title != "Shadows of Forgotten Ancestors" {
		t.Errorf("expected title 'Shadows of Forgotten Ancestors', got '%s'", moviesResponse[1].Title)
	}
}
