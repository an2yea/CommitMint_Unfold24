import {Laptop, Dumbbell, Salad } from 'lucide-react'

export const browseHabits = [
    {   
        id: 1, 
        habitVerifier: "Github",
        icon: Laptop,
        title: "Become a Better Developer!",
        subtitle: "One GitHub commit everyday",
        total_stakers: 15,
        verificationType: "api",
        verificationDetails: {
            apiUrl: "/api/verify/github/",
            params: ["username"],
            frequency: "daily"
        },
     },
     {   
        id: 2, 
        icon: Dumbbell,
        habitVerifier: "Strava",
        title: "Become Fitter!",
        subtitle: "One physical activity everyday!",
        total_stakers: 20,
        verificationType: "api",
        verificationDetails: {
            apiUrl: "/api/verify/strava/",
            params: ["username"],
            frequency: "daily"
        },
     },
     {   
        id: 3, 
        icon: Laptop,
        habitVerifier: "Strava",
        title: "Become a Better Developer!",
        subtitle: "One GitHub commit everyday",
        total_stakers: 15,
        verificationType: "api",
        verificationDetails: {
            apiUrl: "/api/verify/github/",
            params: ["username"],
            frequency: "daily"
        },
     },
  ]


//   {
// 	"id": 1 // for react listing
//   "habitId": "unique_habit_id",
//   "heading": "Become a Better Developer!",
//   "subheading": "One GitHub commit everyday"
//   "icon": "Book"// "Book", "Dumbbell" etc
//   "total_stakers": 15 // Number of people commited to habit. ToDO: increment on habit creation and decrement on habit completion/failure
//   "verificationType": "api", // Options: 'api', 'manual', 'none'
//   "verificationDetails": {
//     "apiUrl": "/api/verify/github/{username}",//nextjs verification endpoint
//     "params": ["username"], // Additional parameters needed for the API
//     "frequency": "daily" // Could also be 'weekly', 'custom'. Let it be daily for now
//   },
//   "createdAt": "timestamp"
// }