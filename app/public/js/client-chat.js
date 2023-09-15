// yếu cầu server kết nối với client
const socket = io();

document.getElementById("form-messages").addEventListener("submit", (e) => {
  e.preventDefault();
  const messageText = document.getElementById("input-messages").value;
  const acknowledgements = (errors) => {
    if (errors) {
      return alert("tin nhắn không hợp lệ");
    }
    console.log("tin nhắn đã gửi thành công");
  };
  socket.emit(
    "send message from client to server",
    messageText,
    acknowledgements
  );
});

socket.on("send message from server to client", (message) => {
  const {userName, createAt, messageText} = message;
  const messageElement = `
  <div class="message-item">
    <div class="message__row1">
      <p class="message__name">${userName}</p>
      <p class="message__date">${createAt}</p>
    </div>
    <div class="message__row2">
      <p class="message__content">
        ${messageText}
      </p>
    </div>
  </div>
  `
  document.getElementById("app__messages").innerHTML += messageElement;
  document.getElementById("input-messages").value = "";
});

// gửi vị trí
document.getElementById("btn-share-location").addEventListener("click", () => {
  if (!navigator.geolocation) {
    return alert("trình duyệt đang dùng không có hổ trợ tìm ví");
  }
  navigator.geolocation.getCurrentPosition((position) => {
    console.log("position : ", position);
    const { latitude, longitude } = position.coords;
    socket.emit("share location from client to server", {
      latitude,
      longitude,
    });
  });
});

socket.on("share location from server to client", (linkLocation) => {
  const {userName, createAt, messageText} = linkLocation;
  const messageElement = `
  <div class="message-item">
    <div class="message__row1">
      <p class="message__name">${userName}</p>
      <p class="message__date">${createAt}</p>
    </div>
    <div class="message__row2">
      <p class="message__content">
      <a href="${messageText}" target="_blank">Vị trí của ${userName}</a>
      </p>
    </div>
  </div>
  `
  document.getElementById("app__messages").innerHTML += messageElement;
});

// xử lý query string
const queryString = location.search;

const params = Qs.parse(queryString, {
  ignoreQueryPrefix: true,
});

const { room, username } = params;

socket.emit("join room from client to server", { room, username });

// nhận user list và hiển thị lên màn hình
socket.on("send user list from server to client", (userList) => {
  let contentHtml = '';
  userList.map((user) => {
    contentHtml += `<li class="app__item-user">${user.username}</li>`
  })
  document.getElementById("app__list-user--content").innerHTML = contentHtml;
});
