const API_KEY = "810gLClzwFnFJbARupHfv2anOtVllEuoelDd1SJKTmnzVto9x3TBEsSE";

export async function fetchHandcraftImages(query = "handcraft", perPage = 15) {
  const res = await fetch(
    `https://api.pexels.com/v1/search?query=${query}&per_page=${perPage}`,
    {
      method: "GET",
      headers: {
        Authorization: API_KEY,
      },
    }
  );

  if (!res.ok) {
    console.error("Error fetching data from Pexels:", res.status);
    return [];
  }

  const data = await res.json();
  console.log("this is the data of photos", data);
  return data.photos || [];
}
