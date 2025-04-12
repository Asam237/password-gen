import { useState } from "react";
import { DefaultLayout } from "@/layouts/default.layout";
import { PoppinsUiDisplay } from "@/lib/fonts";
import { CgCopy } from "react-icons/cg";
import cn from "clsx";

const Home = () => {
  const [passwordLength, setPasswordLength] = useState(10);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState("");
  const [copySuccess, setCopySuccess] = useState("");

  const calculateStrength = (password: string): string => {
    let strength = 0;

    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;

    if (strength <= 2) return "Weak";
    if (strength === 3) return "Moderate";
    if (strength >= 4) return "Strong";
    return "Weak";
  };

  const generatePassword = () => {
    const lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
    const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numberChars = "0123456789";
    const symbolChars = "!@#$%^&*()_+[]{}|;:,.<>?";
    let characterPool = "";

    if (includeLowercase) characterPool += lowercaseChars;
    if (includeUppercase) characterPool += uppercaseChars;
    if (includeNumbers) characterPool += numberChars;
    if (includeSymbols) characterPool += symbolChars;

    if (characterPool === "") {
      setGeneratedPassword("Please select at least one option.");
      setPasswordStrength("");
      return;
    }

    let password = "";
    for (let i = 0; i < passwordLength; i++) {
      const randomIndex = Math.floor(Math.random() * characterPool.length);
      password += characterPool[randomIndex];
    }

    setGeneratedPassword(password);
    setPasswordStrength(calculateStrength(password));
    setCopySuccess("");
  };

  const copyToClipboard = () => {
    if (
      generatedPassword &&
      generatedPassword !== "Please select at least one option."
    ) {
      navigator.clipboard.writeText(generatedPassword).then(() => {
        setCopySuccess("Password copied to clipboard!");
      });
    } else {
      setCopySuccess("Nothing to copy!");
    }
  };

  return (
    <DefaultLayout
      className={cn(
        PoppinsUiDisplay.className,
        PoppinsUiDisplay.variable,
        "h-screen bg-gradient-to-r from-blue-500 to-indigo-600 flex justify-center items-center"
      )}
    >
      <main className="bg-white w-full max-w-md flex flex-col p-6 rounded-lg shadow-lg space-y-6">
        <h4 className="text-center font-bold text-3xl text-gray-800">
          Password Generator
        </h4>
        <div className="space-y-4">
          <div>
            <label
              htmlFor="password-length"
              className="block text-sm font-medium text-gray-700"
            >
              Password Length:
            </label>
            <input
              id="password-length"
              type="number"
              value={passwordLength}
              onChange={(e) => setPasswordLength(Number(e.target.value))}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter password length"
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="lowercase"
                checked={includeLowercase}
                onChange={(e) => setIncludeLowercase(e.target.checked)}
                className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <label htmlFor="lowercase" className="text-sm text-gray-700">
                Include Lowercase Letters
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="uppercase"
                checked={includeUppercase}
                onChange={(e) => setIncludeUppercase(e.target.checked)}
                className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <label htmlFor="uppercase" className="text-sm text-gray-700">
                Include Uppercase Letters
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="numbers"
                checked={includeNumbers}
                onChange={(e) => setIncludeNumbers(e.target.checked)}
                className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <label htmlFor="numbers" className="text-sm text-gray-700">
                Include Numbers
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="symbols"
                checked={includeSymbols}
                onChange={(e) => setIncludeSymbols(e.target.checked)}
                className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <label htmlFor="symbols" className="text-sm text-gray-700">
                Include Symbols
              </label>
            </div>
          </div>
        </div>
        <button
          onClick={generatePassword}
          className="w-full bg-indigo-600 text-white py-2 rounded-md font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Generate Password
        </button>
        {passwordStrength && (
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Generated Password:{" "}
              <span className="font-bold text-gray-800">
                {generatedPassword}
              </span>
            </p>
          </div>
        )}
        <div className="flex items-center justify-center">
          {passwordStrength && (
            <CgCopy
              className="w-9 h-9 bg-indigo-600 text-white py-2 rounded-md font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 cursor-pointer hover:scale-110 transition-transform duration-200 ease-in-out"
              onClick={copyToClipboard}
              size={24}
            />
          )}
        </div>
        {passwordStrength && (
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Strength:{" "}
              <span
                className={`font-bold ${
                  passwordStrength === "Weak"
                    ? "text-red-600"
                    : passwordStrength === "Moderate"
                    ? "text-yellow-600"
                    : "text-green-600"
                }`}
              >
                {passwordStrength}
              </span>
            </p>
          </div>
        )}
        {copySuccess && (
          <p className="text-center text-sm text-green-600 mt-2">
            {copySuccess}
          </p>
        )}
      </main>
    </DefaultLayout>
  );
};

export default Home;
