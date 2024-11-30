import pandas as pd
import psycopg2

def connect_db():
    try:
        connection = psycopg2.connect(
            dbname="joy_of_painting",
            user="postgres",
            password="password",
            host="localhost"
        )
        return connection
    except Exception as e:
        print(f"Error connecting to database: {e}")
        return None

def load_csv(file_path):
    try:
        df = pd.read_csv(file_path)
        return df
    except Exception as e:
        print(f"Error reading CSV file: {e}")
        return None

def insert_data(connection, df):
    cursor = connection.cursor()

    for _, row in df.iterrows():
        try:
            cursor.execute("""
                INSERT INTO Episodes (EpisodeName, BroadcastDate)
                VALUES (%s, %s)
                ON CONFLICT DO NOTHING;
            """, (row['painting_title'], None))  # Assuming BroadcastDate is not available in this file

            cursor.execute("SELECT EpisodeID FROM Episodes WHERE EpisodeName = %s", (row['painting_title'],))
            episode_id = cursor.fetchone()[0]

            subjects = row['subjects'].split(',')
            for subject in subjects:
                cursor.execute("""
                    INSERT INTO Subjects (EpisodeID, Subject)
                    VALUES (%s, %s)
                    ON CONFLICT DO NOTHING;
                """, (episode_id, subject.strip()))

            colors = row['colors'].split(',')
            for color in colors:
                cursor.execute("""
                    INSERT INTO Colors (EpisodeID, ColorName, HexCode)
                    VALUES (%s, %s, %s)
                    ON CONFLICT DO NOTHING;
                """, (episode_id, color.strip(), None))  # Assuming HexCode is not available

        except Exception as e:
            print(f"Error inserting data: {e}")

    connection.commit()
    cursor.close()

if __name__ == "__main__":
    file_path = "/workspaces/atlas-the-joy-of-painting-api/compiled_data.csv"
    connection = connect_db()

    if connection:
        df = load_csv(file_path)
        if df is not None:
            insert_data(connection, df)
            print("Data imported successfully!")
        else:
            print("Failed to load CSV data.")
        
        connection.close()
    else:
        print("Failed to connect to the database.")
