import yaml
import os
import spotipy
import spotipy.util as util
import spotipy.oauth2 as oauth2
import functions



if __name__ == '__main__':
    with open("config.yml", 'r') as ymlfile:
        cfg = yaml.load(ymlfile)
           
    credentials = oauth2.SpotifyClientCredentials(client_id=cfg['spotify']['client_id'],client_secret=cfg['spotify']['client_secret'])
    token = credentials.get_access_token()
    
    if not token:
        raise Exception('An error occurred while getting an authentication token')
    
    print("Connecting to Spotify...")
    sp = spotipy.Spotify(auth=token)
    
    #export folder 
    csv_folder_relative = 'out\\'
    
    #Queen
    artist_uri = 'spotify:artist:1dfeR4HaWDbWqFHLkxsg1d'

    #The Smiths 
    #artist_uri = 'spotify:artist:3yY2gUcIsjMr8hjo51PoJ8'
        

    csv_folder = os.path.join(os.path.dirname(os.path.abspath(__file__)), csv_folder_relative)
    print("Files will be exported to " + csv_folder)

    artist_ids = []
    #Uncomment to load also the related artists
    #artist_related_artists = sp.artist_related_artists(artist_uri)['artists']    
    #artist_ids = [artist['id'] for artist in artist_related_artists]
    
    #adding also the main artist
    artist_ids.append(artist_uri)

    for artist_id in artist_ids:
        print("Locating album details for {0}".format(artist_id))
        functions.sp_export_all_albums(sp, artist_id, csv_folder)
    
    print("Done")