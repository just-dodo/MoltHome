
interface SlackMessagePayload {
  text?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  blocks?: any;
}

const SLACK_WEBHOOK_URL =
  'https://hooks.slack.com/services/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';

async function sendSlackMessage(payload: SlackMessagePayload) {
  try {
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
