import sdk from 'matrix-js-sdk'

const client = sdk.createClient({
  baseUrl: "https://matrix.org",
  accessToken: "",
  userId: "@USERID:matrix.org"
});

/** Once logged in, client can access access token 
*   console.log(client.getAccessToken());
*/

// Set up connection to server and commence syncing
client.startClient();

// First sync
client.once('sync', function(state, prevState, res){
  console.log(state);
});

//Add listeners for events
// Listen to events happening on timeline where user is member

client.on("Room.timeline", function(event, room, toStartOfTimeline){
  console.log(event.event);
});

//Access store
//List of rooms where user is joined
const rooms = client.getRooms();
rooms.forEach(room => {
  console.log(room.roomId);
});

//Inspect timeline of each room in store
rooms.forEach(room => {
  room.timeline.forEach(t => {
    console.log(JSON.stringify(t.event.content));
  });
});

//Send message to room

//Create content object
const content = {
  "body": "Hello World!",
  "msgtype": "m.text"
};
//Specify room to send to (Room Id of #test:matrix.org)
const testRoomId = "!jhpZBTbckszblMYjMK:matrix.org";

client.sendEvent(testRoomId, "m.room.message", content, "").then((res)=>{
  // message sent successfully
}).catch(err)=> {
  console.log(err);
}
// ========================Bot=================================
// ^ Now we can target message listening and message sending
//Let's create a bot that echos back a message starting with !

client.on("Room.timeline", function(event, room, toStartOfTimeline){
  // only want to respond to messages
  if(event.getType() !== "m.room.message"){
    return;
  }
  
  // key into messages from test room that start with "!"
  
  if(event.getRoomId() === testRoomId && event.getContent().body[0] === "!"){
    sendNotice(event.event.content.body);
  }
});

const sendNotice = (body) => {
  const content = {
    "body": body.substring(1),
    "msgtype": "m.notice"
  };
  client.sendEvent(testRoomId, "m.room.message", content, "", (err, res)=> {
    console.log(err);
  });
}
