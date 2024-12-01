// src/app/api/verify/github/[username]/route.ts
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

// Type for GitHub event
interface GitHubEvent {
  type: string;
  created_at: string;
}

const GITHUB_API_URL = process.env.GITHUB_API_URL;
const GITHUB_API_KEY = process.env.GITHUB_API_KEY;

export async function POST(
  request: NextRequest,
  { params }: { params: { username: string } }
) {
  const { username } = params;
  const today = new Date().toISOString().split('T')[0];

  try {
    const response = await fetch(`${GITHUB_API_URL}/users/${username}/events/public`, {
      headers: {
        'Authorization': `token ${GITHUB_API_KEY}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch GitHub events');
    }

    const events: GitHubEvent[] = await response.json();
    const doneToday = events.some(event => {
      if (event.type === 'PushEvent') {
        return event.created_at.startsWith(today);
      }
      return false;
    });

    return NextResponse.json({ doneToday });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to verify commit' }, { status: 500 });
  }
}

// Logic to call this API route from the frontend 


// const verifyGithubCommit = async () => {
//     try {
//       const response = await fetch('/api/verify/github/yajassardana');
//       const data = await response.json();
//       console.log(data);
//     } catch (error) {
//       console.error('Failed to verify GitHub commit:', error);
//     }
//   }