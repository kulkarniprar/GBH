import folium
import pandas as pd
from folium.plugins import HeatMap

# Load CSV file
csv_file = "C:\\GIH\\nammayatri\\ny\\GBH\\src\\Components\\hm\\hmv\\withcoordinates.csv"  # Ensure correct path
df = pd.read_csv(csv_file)

# Drop missing values and ensure proper types
df = df.dropna(subset=['Latitude', 'Longitude', 'Searches'])
df['Latitude'] = df['Latitude'].astype(float)
df['Longitude'] = df['Longitude'].astype(float)

# ✅ Remove commas & convert 'Searches' to float
df['Searches'] = df['Searches'].str.replace(',', '').astype(float)

# Create a map centered on the dataset
m = folium.Map(location=[df["Latitude"].mean(), df["Longitude"].mean()], zoom_start=12)

# Prepare heatmap data
heat_data = [[row['Latitude'], row['Longitude'], row['Searches']] for _, row in df.iterrows()]

# Add Heatmap layer
HeatMap(heat_data, radius=15, blur=10, max_zoom=12).add_to(m)

# Save HTML inside the public folder so React can access it
m.save("C:\\GIH\\nammayatri\\ny\\GBH\\public\\heatmap.html")  # ✅ Relative path


print("✅ Heatmap saved as public/heatmap.html")
