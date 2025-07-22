// Import necessary modules using ES Module syntax
import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors'; // Import the cors middleware

// Initialize the express app
const app = express();
const PORT = 3001;

// --- Middleware ---
// Enable CORS for all routes. This allows your React app (on a different port)
// to make requests to this server.
app.use(cors());

// Enable the express.json middleware to parse JSON request bodies
app.use(express.json());


// --- Routes ---
// Define a POST route to handle requests to /leetcode
app.post('/leetcode', async (req, res) => {
  try {
    // Destructure the username from the request body
    const { username } = req.body;

    // Check if a username was provided
    if (!username) {
      return res.status(400).json({ error: 'Username is required' });
    }

    // The GraphQL query to fetch user data from LeetCode
    const query = `
      query getUserProfile($username: String!) {
        matchedUser(username: $username) {
          username
          profile {
            realName
            userAvatar
            ranking
          }
          submitStats: submitStatsGlobal {
            acSubmissionNum {
              difficulty
              count
            }
          }
        }
      }
    `;

    // Make the fetch request to the LeetCode GraphQL API
    const response = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Referer': `https://leetcode.com/${username}/` // Adding a referer can sometimes help avoid being blocked
      },
      body: JSON.stringify({
        query: query,
        variables: { username }
      })
    });

    // Check if the fetch request was successful
    if (!response.ok) {
        throw new Error(`LeetCode API responded with status: ${response.status}`);
    }

    // Parse the JSON response from the LeetCode API
    const data = await response.json();

    // Send the data back to the client
    res.json(data);

  } catch (error) {
    // Log the error to the console for debugging
    console.error('Error in /leetcode proxy:', error);
    // Send a generic error message to the client
    res.status(500).json({ error: 'Failed to fetch data from LeetCode' });
  }
});


// --- Server Start ---
// Start the server and listen on the specified port
app.listen(PORT, () => {
  console.log(`✅ Proxy server running on http://localhost:${PORT}`);
});
