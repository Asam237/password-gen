import { DefaultLayout } from "@/layouts/default.layout";
import { PoppinsUiDisplay } from "@/lib/fonts";
import cn from "clsx";

const Home = () => {
  return (
    <DefaultLayout
      className={cn(
        PoppinsUiDisplay.className,
        PoppinsUiDisplay.variable,
        "h-screen bg-slate-500 flex justify-center items-center"
      )}
    >
      <main className="bg-gray-50 w-1/3 flex flex-col p-4 rounded-md">
        <h4>Password Generator</h4>
        <div>
          <p>Password Length: </p>
          <input
            type="number"
            min={1}
            max={100}
            className="border-2 border-gray-300 rounded-md p-2"
            placeholder="Enter password length"
          />
          <div>
            <select name="#" id="#">
              Include Lowercase Letters
            </select>
            <select name="#" id="#">
              Include Uppercase Letters
            </select>
            <select name="#" id="#">
              Include Numbers
            </select>
            <select name="#" id="#">
              Include Symbils
            </select>
          </div>
        </div>
        <button>Generate Password</button>
        <div>
          <p>Strength: Strong</p>
        </div>
      </main>
    </DefaultLayout>
  );
};

export default Home;
