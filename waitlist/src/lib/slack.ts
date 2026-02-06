
interface SlackMessagePayload {
  text?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  blocks?: any;
}

const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL || '';

async function sendSlackMessage(payload: SlackMessagePayload) {
  try {    
    if (!SLACK_WEBHOOK_URL) {
      console.error('SLACK_WEBHOOK_URL is not set');
      return null;
    }
    const response = await fetch(SLACK_WEBHOOK_URL, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return response.json();
  } catch (error) {
    console.error('Error sending Slack message:', error);
    return null;
  }
}

async function sendWaitlistSignupMessage(email: string) {
  try {
    const response = await sendSlackMessage({
      blocks: [
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: 'New Waitlist Signup',
            emoji: true,
          },
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `Email: ${email}`,
          }
        },
      ],
    });
    return response.json();
  } catch (error) {
    console.error('Error sending IG Account Connected message:', error);
    return null;
  }
}

export { sendSlackMessage, sendWaitlistSignupMessage };
