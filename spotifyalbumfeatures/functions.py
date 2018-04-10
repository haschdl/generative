import unicodecsv as csv
import os
import sys
import spotipy
import spotipy.util as util
import json

from spotipy.oauth2 import SpotifyClientCredentials

def show_tracks(tracks):
    for i, item in enumerate(tracks['items']):
        track = item['track']
        print('{0} {1} {2}'.format(i, track['artists'][0]['name'],track['name']))

def array_to_csv(arr, csvpath):
    keys = arr[0].keys()           
    os.makedirs(os.path.dirname(csvpath), exist_ok=True)     
    with open(csvpath, 'wb') as output_file:
        dict_writer = csv.DictWriter(output_file, keys,delimiter=';')                
        dict_writer.writeheader()
        for data in arr:
            dict_writer.writerow(data)
    print('File saved: ' + csvpath)

def sp_export_all_albums(sp, artist_uri,csv_folder):
    #'limit' cannot be greater than 50 or S; 50 is enough for most artists.
    artist_name = sp.artist(artist_uri)['name']
    albums = sp.artist_albums(artist_uri,album_type='album',country='GB',limit=50)
       
    albuns_details = [];
    album_track_details = []
    album_track_features = []
    album_ids = []
    #fetching IDs to request the full album object with more details about the album
    album_ids = [album[1]['id'] for album in enumerate(albums['items'])] 

    for album_id in album_ids:
        #print('Album: {0} Release date:{1}'.format(album[1]['name'], album[1]['release_date']));
        album_full = sp.album(album_id) 
        album_track_duration = 0
        track_ids =  [track[1]['id'] for track in enumerate(album_full['tracks']['items'])] 
        
        album_track_duration = sum(track[1]['duration_ms'] for track in enumerate(album_full['tracks']['items']))                
        album_details = {'artist_name':artist_name,
                        'album_id':album_full['id'],
                        'album_name':album_full['name'],
                        'album_release_date':album_full['release_date'],
                        'tracks_total':album_full['tracks']['total'],
                        'track_duration_ms':album_track_duration
                        }    
        albuns_details.append(album_details)

        #Getting features for each audio            
        features=sp.audio_features(track_ids)
        for feat in features:
            album_track_feature = { 'artist_name':artist_name,
                                    'album_id': album_full['id'],
                                    'album_name': album_full['name'],
                                    'album_release_date':album_full['release_date'],
                                    'track_id': feat['id'],
                                    'instrumentalness': feat['instrumentalness'], 
                                    'speechiness': feat['speechiness'], 
                                    'acousticness': feat['acousticness'], 
                                    'mode': feat['mode'], 
                                    'danceability':feat['danceability'], 
                                    'valence': feat['valence'], 
                                    'energy': feat['energy'], 
                                    'tempo': feat['tempo'], 
                                    'liveness': feat['liveness'], 
                                    'loudness': feat['loudness'], 
                                    'time_signature': feat['time_signature'],                                     
                                    'duration_ms': feat['duration_ms'], 
                                    'key': feat['key']
                                    }                                         
            album_track_features.append(album_track_feature)
     
    array_to_csv(album_track_features, csv_folder + 'Spotify_Track_Features_{0}.csv'.format(artist_name))
    array_to_csv(albuns_details,csv_folder + 'Spotify_Albums_{0}.csv'.format(artist_name))