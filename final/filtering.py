
import folium
from folium.plugins import MarkerCluster
from geopy.distance import geodesic

# Create Mumbai map
mumbai_map = folium.Map(location=[19.0760, 72.8777], zoom_start=11)
marker_cluster = MarkerCluster().add_to(mumbai_map)

# User input location (example: South Mumbai)
user_lat, user_lon = 19.0999, 72.8519

# Crime type color mapping
color_mapping = {
    "Murder": "red",
    "Robbery": "green",
    "Kidnapping": "purple",
    "Drink and Drive": "blue",
    "Rape": "pink",
    "Violence": "beige"
}

# Load crime data
crime_data = [
  (18.984928, 72.875279, "Solved", "Kiran Shetty", "Robbery", 2022000, 2025),
  (19.021808, 72.824203, "Unsolved", "Manisha Gokhale", "Murder", 2023954, 2023),
  (19.134659, 72.885825, "Unsolved", "Namrata Joshi", "Violence", 2023955, 2022),
  (19.013639, 72.884235, "Unsolved", "Dinesh Menon", "Robbery", 2023956, 2024),
  (19.142741, 72.880723, "Unsolved", "Jagdish Pillai", "Rape", 2023957, 2023),
  (19.155577, 72.88309, "Unsolved", "Deepak Joshi", "Violence", 2023958, 2023),
  (18.980747, 72.863821, "Unsolved", "Sarita Yadav", "Rape", 2023959, 2023),
  (18.973275, 72.867376, "Unsolved", "Manoj Khanna", "Murder", 2023960, 2025),
  (19.155988, 72.932674, "Unsolved", "Snehal Shetty", "Drink and Drive", 2023961, 2023),
  (19.075319, 72.930106, "Unsolved", "Rohini Nair", "Suicide", 2023962, 2022),
  (19.159086, 72.894854, "Unsolved", "Richa Iyer", "Robbery", 2023963, 2023),
  (19.172457, 72.827071, "Unsolved", "Namrata Joshi", "Murder", 2023964, 2025),
  (19.114249, 72.865584, "Unsolved", "Umesh Yadav", "Violence", 2023965, 2022),
  (19.075563, 72.88244, "Unsolved", "Sarita Yadav", "Drink and Drive", 2023966, 2022),
  (19.187617, 72.883247, "Unsolved", "Sunil Patil", "Murder", 2023967, 2023),
  (19.033206, 72.853914, "Unsolved", "Vikram Singh", "Rape", 2023968, 2022),
  (19.020146, 72.856218, "Unsolved", "Kiran Shetty", "Robbery", 2023969, 2024),
  (19.036151, 72.896303, "Unsolved", "Nilesh Khot", "Violence", 2023970, 2025),
  (19.108248, 72.902765, "Unsolved", "Suresh Pandey", "Drink and Drive", 2023971, 2022),
  (19.154668, 72.931232, "Unsolved", "Sunil Patil", "Kidnapping", 2023972, 2022),
  (19.010267, 72.87844, "Unsolved", "Suresh Pandey", "Robbery", 2023973, 2025),
  (19.059995, 72.850756, "Unsolved", "Sarita Yadav", "Drink and Drive", 2023974, 2024),
  (19.096832, 72.889797, "Unsolved", "Dinesh Menon", "Violence", 2023975, 2024),
  (18.999163, 72.853556, "Unsolved", "Richa Iyer", "Kidnapping", 2023976, 2025),
  (19.04042, 72.836391, "Unsolved", "Suresh Pandey", "Murder", 2023978, 2025),
  (19.020779, 72.902822, "Unsolved", "Sarita Yadav", "Violence", 2023979, 2024),
  (18.976729, 72.876873, "Unsolved", "Suresh Pandey", "Rape", 2023980, 2024),
  (19.057574, 72.924603, "Unsolved", "Snehal Shetty", "Suicide", 2023981, 2025),
  (19.050991, 72.90055, "Unsolved", "Neeraj Chavan", "Violence", 2023982, 2024),
  (18.984795, 72.908495, "Unsolved", "Jitendra Patel", "Violence", 2023983, 2024),
  (19.177744, 72.868991, "Unsolved", "Sandeep Chauhan", "Suicide", 2023984, 2022),
  (19.127678, 72.84455, "Solved", "Namrata Joshi", "Drink and Drive", 2022001, 2025),
  (19.189635, 72.929793, "Solved", "Snehal Shetty", "Violence", 2022002, 2025),
  (19.10319, 72.850927, "Solved", "Dinesh Menon", "Murder", 2022003, 2023),
  (19.160648, 72.874046, "Solved", "Richa Iyer", "Rape", 2022004, 2025),
  (19.137801, 72.87589, "Solved", "Manisha Gokhale", "Drink and Drive", 2022005, 2023),
  (19.047969, 72.915267, "Solved", "Rajiv Menon", "Robbery", 2022006, 2024),
  (19.160493, 72.837637, "Solved", "Sandeep Chauhan", "Murder", 2022007, 2022),
  (18.984403, 72.883753, "Solved", "Namrata Joshi", "Kidnapping", 2022008, 2025),
  (19.083873, 72.935879, "Solved", "Vikram Singh", "Murder", 2022009, 2023),
  (19.031023, 72.863793, "Solved", "Richa Iyer", "Murder", 2022010, 2025),
  (19.085695, 72.832814, "Solved", "Rohini Nair", "Drink and Drive", 2022011, 2022),
  (18.983274, 72.878651, "Solved", "Sarita Yadav", "Murder", 2022012, 2023),
  (19.175809, 72.821119, "Solved", "Neeraj Chavan", "Robbery", 2022013, 2022),
  (19.054029, 72.906565, "Solved", "Nilesh Khot", "Suicide", 2022014, 2023),
  (18.991188, 72.824161, "Solved", "Umesh Yadav", "Murder", 2022015, 2022),
  (18.971358, 72.880533, "Solved", "Jagdish Pillai", "Kidnapping", 2022016, 2025),
  (19.115619, 72.863876, "Solved", "Nilesh Khot", "Suicide", 2022017, 2024),
  (18.979072, 72.896908, "Solved", "Richa Iyer", "Suicide", 2022018, 2025),
  (18.998281, 72.93779, "Solved", "Rohini Nair", "Suicide", 2022019, 2024),
  (18.975779, 72.85439, "Solved", "Jitendra Patel", "Murder", 2022020, 2025),
  (19.161114, 72.823995, "Solved", "Richa Iyer", "Rape", 2022021, 2025),
  (19.064063, 72.906211, "Solved", "Namrata Joshi", "Kidnapping", 2022022, 2022),
  (19.06549, 72.881364, "Solved", "Umesh Yadav", "Drink and Drive", 2022023, 2022),
  (19.008173, 72.915339, "Solved", "Sandeep Chauhan", "Drink and Drive", 2022024, 2023),
  (19.167171, 72.853635, "Solved", "Harish Pillai", "Kidnapping", 2022025, 2025),
  (19.046884, 72.899448, "Solved", "Vivek Kapoor", "Robbery", 2022026, 2025),
  (19.150537, 72.857333, "Solved", "Sneha Nair", "Murder", 2022027, 2022),
  (19.151888, 72.928271, "Solved", "Suresh Pandey", "Kidnapping", 2022028, 2024),
  (19.173342, 72.893629, "Solved", "Sarita Yadav", "Violence", 2022034, 2022),
  (19.033267, 72.890343, "Solved", "Vikram Singh", "Robbery", 2022035, 2025, ),
  (19.058651, 72.894302, "Solved", "Manoj Khanna", "Rape", 2022036, 2025,),
  (19.064434, 72.849617, "Solved", "Sarita Yadav", "Violence", 2022037, 2022,),
  (19.111366, 72.895386, "Solved", "Vivek Kapoor", "Drink and Drive", 2022038, 2023,),
  (19.148898, 72.840443, "Solved", "Manoj Khanna", "Suicide", 2022039, 2022,),
  (18.995983, 72.867057, "Solved", "Rajiv Menon", "Rape", 2022040, 2022,),
  (19.126625, 72.878575, "Solved", "Namrata Joshi", "Suicide", 2022041, 2025,),
  (19.051694, 72.91043, "Solved", "Namrata Joshi", "Kidnapping", 2022042, 2023,),
  (19.139049, 72.855441, "Solved", "Rohini Nair", "Rape", 2022043, 2023,),
  (19.062822, 72.870359, "Solved", "Kiran Shetty", "Drink and Drive", 2022044, 2024, ),
  (19.161475, 72.849838, "Solved", "Vikram Singh", "Violence", 2022045, 2024, ),
  (19.041059, 72.923685, "Solved", "Ravindra Purohit", "Suicide", 2022046, 2022,),
  (19.053113, 72.822986, "Solved", "Jagdish Pillai", "Drink and Drive", 2022047, 2024,),
  (18.978872, 72.910293, "Solved", "Sneha Nair", "Violence", 2022048, 2025,),
  (19.100194, 72.858232, "Solved", "Nilesh Khot", "Murder", 2022049, 2023, ),
  (19.100197, 72.889745, "Solved", "Dinesh Menon", "Kidnapping", 2022050, 2023, ),
  (19.086265, 72.900575, "Solved", "Deepak Joshi", "Drink and Drive", 2022051, 2022,),
  (19.082043, 72.877685, "Solved", "Ravi Kumar", "Drink and Drive", 2022052, 2024, ),
  (19.177186, 72.866338, "Solved", "Ravindra Purohit", "Robbery", 2022053, 2022,),
  (19.001711, 72.907944, "Solved", "Jagdish Pillai", "Murder", 2022054, 2024,),
  (18.996526, 72.890654, "Solved", "Neeraj Chavan", "Robbery", 2022055, 2023,),
  (19.018828, 72.902362, "Solved", "Kiran Shetty", "Suicide", 2022056, 2025, ),
  (19.082454, 72.844859, "Solved", "Sandeep Chauhan", "Kidnapping", 2022057, 2022,),
  (19.046659, 72.881023, "Solved", "Jitendra Patel", "Drink and Drive", 2022058, 2024,),
  (19.010794, 72.93626, "Solved", "Rajiv Menon", "Rape", 2022059, 2022,),
  (19.098724, 72.891041, "Solved", "Dinesh Menon", "Violence", 2022060, 2025, ),
  (19.009418, 72.872865, "Solved", "Deepak Joshi", "Murder", 2022061, 2022,),
  (19.062587, 72.911387, "Solved", "Manisha Gokhale", "Murder", 2022062, 2024,),
  (18.981563, 72.88325, "Solved", "Sunil Patil", "Drink and Drive", 2022063, 2022, ),
  (19.174355, 72.889486, "Solved", "Vivek Kapoor", "Murder", 2022064, 2022,),
  (19.05357, 72.912411, "Solved", "Nilesh Khot", "Drink and Drive", 2022065, 2024, )
]

# Filter cases within 3 km radius
filtered_cases = [
    (lat, lon, status, officer, crime_type, case_id, year, geodesic((user_lat, user_lon), (lat, lon)).km)
    for lat, lon, status, officer, crime_type, case_id, year in crime_data
    if geodesic((user_lat, user_lon), (lat, lon)).km <= 3
]

# Create Mumbai map
mumbai_map = folium.Map(location=[user_lat, user_lon], zoom_start=11)
marker_cluster = MarkerCluster().add_to(mumbai_map)

# Add markers for the filtered cases
for lat, lon, status, officer, crime_type, case_id, year, distance in filtered_cases:
    popup_content = f"""
        <b>Crime Type:</b> {crime_type}<br>
        <b>Status:</b> {status}<br>
        <b>Officer:</b> {officer}<br>
        <b>Case ID:</b> {case_id}<br>
        <b>Year:</b> {year}<br>
        <b>Distance:</b> {distance:.2f} km<br>
    """
    folium.Marker(
        location=[lat, lon],
        popup=popup_content,
        icon=folium.Icon(color=color_mapping.get(crime_type, "gray"))
    ).add_to(marker_cluster)

    # Add path from user location to crime location
    folium.PolyLine(
        [(user_lat, user_lon), (lat, lon)],
        color="blue",
        weight=2.5,
        opacity=0.8
    ).add_to(mumbai_map)

    # Add user location marker with a distinct icon
    folium.Marker(
        location=[user_lat, user_lon],
        popup="<b>Police Station</b>",
        icon=folium.Icon(icon="star", color="black")
    ).add_to(mumbai_map)

# Save map
mumbai_map.save("mumbai_filtered_crime_map.html")
print("Filtered crime map generated! Open 'mumbai_filtered_crime_map.html' in a browser.")