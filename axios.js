const progressBar = document.getElementById("progressBar");
const body = document.body;
const url = `https://api.thecatapi.com/v1/breeds`;

async function axiosLoad() {
  try {
    const response = await axios.get(url);
    // console.log("response", response);
    const breeds = response.data;
    console.log("breeds", breeds);
  } catch (e) {
    console.log(e);
  }
}

axios.interceptors.request.use((request) => {
  console.log("request has begun.");
  progressBar.style.width = "0%";
  body.style.cursor = "progress";
  request.metadata = request.metadata || {};
  request.metadata.startTime = new Date().getTime();
  return request;
});

axios.interceptors.response.use(
  (response) => {
    response.config.metadata.endTime = new Date().getTime();
    response.durationInMS =
      response.config.metadata.endTime - response.config.metadata.startTime;
    console.log("time in ms is", response.durationInMS);
    body.style.cursor = "default";
    return response;
  },
  (error) => {
    error.config.metadata.endTime = new Date().getTime();
    error.durationInMS =
      error.config.metadata.endTime - error.config.metadata.startTime;
    throw error;
  }
);

function updateProgress(pe) {
  axios
    .get(url, {
      headers: {
        "Accept-Encoding": "",
      },
      onDownloadProgress: () => {
        // Handle progress
        progressBar.max = pe.total;
        progressBar.value = pe.loaded;
        console.log(pe);
      },
    })
    .then((response) => {
      console.log("Request completed");
    })
    .catch((error) => {
      console.error("Request error:", error);
    });
}

axiosLoad();
