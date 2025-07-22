import React, { useState } from 'react'
import { useLoaderData, useNavigate } from 'react-router-dom'

function Github() {
    const data = useLoaderData()
    const [inputUser, setInputUser] = useState("");
    const navigate = useNavigate();
    // If LeetCode data, show a nice profile card
    if (data && data.leetcodeUser) {
        const user = data.leetcodeUser;
        const stats = user.submitStats?.acSubmissionNum || [];
        const getSolved = (difficulty) => {
            const found = stats.find(s => s.difficulty === difficulty);
            return found ? found.count : 0;
        };
        const totalSolved = getSolved('Easy') + getSolved('Medium') + getSolved('Hard');
        const handleGoToLeetCode = () => {
            if (inputUser.trim()) {
                window.open(`https://leetcode.com/${inputUser.trim()}/`, '_blank');
            }
        };
        return (
            <div className="flex flex-col items-center min-h-[60vh] bg-gradient-to-br from-yellow-100 to-orange-200 py-8">
                <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center mb-6">
                    <img
                        src={user.profile.userAvatar}
                        alt="LeetCode Avatar"
                        className="mx-auto rounded-full border-4 border-orange-400 w-32 h-32 mb-4 shadow"
                    />
                    <h2 className="text-2xl font-bold text-gray-800">{user.username}</h2>
                    <p className="text-lg text-gray-600 mb-2">{user.profile.realName}</p>
                    <div className="flex justify-center gap-4 my-4">
                        <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-semibold shadow">Ranking: {user.profile.ranking}</span>
                    </div>
                    <div className="mt-6">
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">Solved Problems</h3>
                        <div className="flex justify-center gap-4 mb-2">
                            <div className="bg-green-100 text-green-700 px-3 py-1 rounded-lg font-medium">
                                Easy: {getSolved('Easy')}
                            </div>
                            <div className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-lg font-medium">
                                Medium: {getSolved('Medium')}
                            </div>
                            <div className="bg-red-100 text-red-700 px-3 py-1 rounded-lg font-medium">
                                Hard: {getSolved('Hard')}
                            </div>
                        </div>
                        <div className="text-md font-semibold text-gray-800 mt-2">
                            Total Solved: <span className="text-orange-600">{totalSolved}</span>
                        </div>
                    </div>
                    <a
                        href={`https://leetcode.com/${user.username}/`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-6 bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-6 rounded-full shadow transition"
                    >
                        View on LeetCode
                    </a>
                </div>
                {/* Username input and button */}
                <div className="bg-white rounded-xl shadow p-4 flex flex-col items-center w-full max-w-md">
                    <label className="mb-2 text-gray-700 font-medium">Go to LeetCode Profile</label>
                    <div className="flex w-full gap-2">
                        <input
                            type="text"
                            placeholder="Enter LeetCode username"
                            value={inputUser}
                            onChange={e => setInputUser(e.target.value)}
                            className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                        />
                        <button
                            onClick={handleGoToLeetCode}
                            className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-4 py-2 rounded transition"
                        >
                            Go
                        </button>
                        <button
                            onClick={() => {
                                if (inputUser.trim()) {
                                    navigate(`/${inputUser.trim()}`);
                                }
                            }}
                            className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-4 py-2 rounded transition"
                        >
                            Open in App
                        </button>
                    </div>
                </div>
            </div>
        )
    }
    // Default: Github info
    return (
        <div className='text-center m-4 bg-gray-600 text-white p-4 text-3xl'>Github followers: {data.followers}
        <img src={data.avatar_url} alt="Git picture" width={300} />
        </div>
    )
}

export default Github

export const githubInfoLoader = async () => {
    const response = await fetch('https://api.github.com/users/hiteshchoudhary')
    return response.json()
}

export const UserinfoLoader = async ({ params }) => {
    const { userid } = params;
    const response = await fetch('http://localhost:3001/leetcode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: userid })
    });
    const result = await response.json();
    return { leetcodeUser: result.data.matchedUser };
}