import { Link } from "react-router-dom";
import useStore from "../store/store";
import { useEffect, useState } from "react";
import axios from "axios";
import Markdown from "react-markdown";
import { Circles } from "react-loader-spinner";

const BASE_URL = "http://172.28.31.141:8000";

function Blog() {
  const itineray = useStore((state) => state.itinerary);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchBlog = async () => {
    setLoading(true);
    const res = await axios.post(`${BASE_URL}/model/blog`, {
      prompt:
        JSON.stringify(itineray) +
        "\n\n this is the details about my recent travels. now write an engaging blog post about it. Add three new lines between each paragraph and include many subheaders. Make the first sentence the title and bigger than the subheaders. Do it under 500 words",
    });
    const { data } = res;
    setText(data.content);
    setLoading(false);
  };
  useEffect(() => {
    if (itineray.query) {
      fetchBlog();
    }
  }, []);

  if (!itineray.query) {
    return (
      <div className="max-w-[700px] w-[90%] mx-auto py-6">
        <p className="text-center text-lg font-medium">
          You have not created an itinerary yet.
        </p>
        <p className="text-center text-lg font-medium">
          Create one{" "}
          <Link
            to="/itinerary"
            className="text-purple-700"
          >
            here.
          </Link>
        </p>
      </div>
    );
  } else {
    return (
      <div className="max-w-[700px] w-[90%] mx-auto py-6">
        {loading ? (
          <div className="flex justify-center py-6">
            <Circles
              height="100"
              width="100"
              color="#9333ea"
              ariaLabel="circles-loading"
              wrapperStyle={{}}
              wrapperClass=""
              visible={true}
            />
          </div>
        ) : (
          <Markdown>{text}</Markdown>
        )}
      </div>
    );
  }
}
export default Blog;
