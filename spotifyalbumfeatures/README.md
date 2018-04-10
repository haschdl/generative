# Python extractor for Spotify API
This is not a generic, all-purpose script, but more a one-off thing to collect data to use as input for a data visualization project. 
It uses [spotipy](https://spotipy.readthedocs.io/en/latest/) to communicate with Spotify API.  The main goal was collect data for a poster/infographic experiment, shown below.

It is tailored to get the audio features for all the songs of a givent artist, grouped by album. The audio features, calculated by Spotify algorithms, are for example "danceability" and "loudness". 
Example of audio features:
```json
{
  "danceability" : 0.735,
  "energy" : 0.578,
  "key" : 5,
  "loudness" : -11.840,
  "mode" : 0,
  "speechiness" : 0.0461,
  "acousticness" : 0.514,
  "instrumentalness" : 0.0902,
  "liveness" : 0.159,
  "valence" : 0.624,
  "tempo" : 98.002,
  "type" : "audio_features",
  "id" : "06AKEBrKUckW0KREUWRnvT",
  "uri" : "spotify:track:06AKEBrKUckW0KREUWRnvT",
  "track_href" : "https://api.spotify.com/v1/tracks/06AKEBrKUckW0KREUWRnvT",
  "analysis_url" : "https://api.spotify.com/v1/audio-analysis/06AKEBrKUckW0KREUWRnvT",
  "duration_ms" : 255349,
  "time_signature" : 4
}
````
# How to use
1. From Spotify, copy the link to an artist, and add it to albumfeaures.py:
```python
#Queen
    artist_uri = 'spotify:artist:1dfeR4HaWDbWqFHLkxsg1d'
```` 
2. Optionally, update the output location
```python
#export folder
    csv_folder = 'C:/temp/SpotifyAPI/'
    print("Files will be exported to " + csv_folder)
```
3. Run albumfeatures.py

# Output file
I used the output file to create a visualization in Nodebox, node-based software application for generative design. For this collage, I took inspiration from "Music Moods", a work by Amanda Rapien (see http://pin.it/D14zksZ).
![](nodebox/Queen%20Album%20Features.png)

