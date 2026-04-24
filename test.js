const myHeaders = new Headers();
myHeaders.append("X-App-Name", "myapp");
myHeaders.append("X-Version", "latest");
myHeaders.append(
  "Authorization",
  "Bearer t-g1044nctWHUHOL2EADTWN2TJ2U3B2I4NEADLXR2W"
);
myHeaders.append("Content-Type", "application/json");

const raw = JSON.stringify({
  client_id: "Ov23liGzP1GhtUZYSTin",
  client_secret: "fb59032ebe6fb47ad103e9a04068e27c90536368",
  code: "7e19cdc5dd12d9c5f72b",
  redirect_uri: "http://localhost:8083/ipassTool/authcheck",
});

const requestOptions = {
  method: "GET",
  headers: myHeaders,
  redirect: "follow",
};

fetch(
  "https://open.feishu.cn/open-apis/drive/v1/medias/I8xUbzXq4oJzjexR5UNcPjJfnJe/download",
  requestOptions
)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
