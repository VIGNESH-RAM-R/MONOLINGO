Read AGENTS.md first and follow it strictly.

Use the installed Vision Agents skill and Stream skills to connect the Audio Lesson screen to the Vision Agent so the AI teacher joins the same Stream call as the user. 

Add Expo API routes to start and stop the agent that proxy to the Vision Agent server. Before creating the Stream call, persist the full AI teacher prompt server-side under an opaque session ID. Pack the selected lesson, language, goals, vocabulary, phrases, and only that session ID into the Stream call's custom data; never include the full prompt there. Update the Python agent to read the session ID and retrieve the stored prompt server-side on join, while continuing to consume the lesson, language, goals, vocabulary, and phrases fields from the call data.

Make sure the agent has permission to publish audio in audio_room (admin role + goLive). Clean up the agent session both when the user ends the call and when the screen unmounts. 

Do not expose any secrets in the mobile app. Keep the existing Stream audio flow intact. Show the agent connection status with idle, connecting, connected, and failed states.