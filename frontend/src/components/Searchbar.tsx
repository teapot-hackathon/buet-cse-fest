import { Circles } from "react-loader-spinner";

type Props = {
  text: string;
  setText: (val: string) => void;
  handleSubmit: () => void;
  loading?: boolean;
  placeholder?: string;
};

function Searchbar({
  text,
  setText,
  handleSubmit,
  loading,
  placeholder,
}: Props) {
  return (
    <div className="mb-6">
      <div className="w-[70%] max-w-[1200px] mx-auto mt-6">
        <div className="w-[80%] max-w-[650px] mx-auto relative">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            width="26"
            height="26"
            viewBox="0 0 24 24"
            className="absolute top-4 left-3"
          >
            <path d="M 9 2 C 5.1458514 2 2 5.1458514 2 9 C 2 12.854149 5.1458514 16 9 16 C 10.747998 16 12.345009 15.348024 13.574219 14.28125 L 14 14.707031 L 14 16 L 20 22 L 22 20 L 16 14 L 14.707031 14 L 14.28125 13.574219 C 15.348024 12.345009 16 10.747998 16 9 C 16 5.1458514 12.854149 2 9 2 z M 9 4 C 11.773268 4 14 6.2267316 14 9 C 14 11.773268 11.773268 14 9 14 C 6.2267316 14 4 11.773268 4 9 C 4 6.2267316 6.2267316 4 9 4 z"></path>
          </svg>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full py-4 pl-12 shadow-[0_2px_3px_rgb(0,0,0,0.15)] rounded-full border-[2px] border-solid border-[#e0e0e0] text-lg"
            placeholder={placeholder ? placeholder : "Search..."}
          />

          {loading ? (
            <div className="absolute right-4 top-4">
              <Circles
                height="30"
                width="30"
                color="#9333ea"
                ariaLabel="circles-loading"
                wrapperStyle={{}}
                wrapperClass=""
                visible={true}
              />
            </div>
          ) : (
            <button
              className="font-bold bg-purple-600 py-3 px-6 text-white rounded-full absolute right-4 top-2"
              onClick={handleSubmit}
            >
              Search
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
export default Searchbar;
