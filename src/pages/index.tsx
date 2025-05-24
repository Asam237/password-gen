import { useState, useEffect } from "react";
import {
  Copy,
  RefreshCw,
  Shield,
  Eye,
  EyeOff,
  Save,
  Trash2,
  Search,
  Plus,
  Edit3,
  X,
  FolderOpen,
  Lock,
} from "lucide-react";

const PasswordGenerator = () => {
  const [passwordLength, setPasswordLength] = useState(12);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    label: "",
    color: "",
  });
  const [copySuccess, setCopySuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  // Password management states
  interface PasswordEntry {
    id: string;
    password: string;
    title: string;
    username: string;
    category: string;
    notes: string;
    strength: { score: number; label: string; color: string };
    createdAt: string;
    lastModified: string;
  }

  const [savedPasswords, setSavedPasswords] = useState<
    Record<string, PasswordEntry>
  >({});
  const [currentView, setCurrentView] = useState("generator"); // 'generator' or 'vault'
  const [categories, setCategories] = useState([
    "Personal",
    "Work",
    "Social Media",
    "Banking",
    "Shopping",
  ]);
  const [selectedCategory, setSelectedCategory] = useState("Personal");
  const [searchTerm, setSearchTerm] = useState("");
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [newCategoryName, setNewCategoryName] = useState("");

  // Save password modal states
  const [saveData, setSaveData] = useState({
    title: "",
    username: "",
    category: "Personal",
    notes: "",
  });

  // Load saved data on component mount
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("passwordVault") || "{}");
    setSavedPasswords(saved);

    const savedCategories = JSON.parse(
      localStorage.getItem("passwordCategories") || "[]"
    );
    if (savedCategories.length > 0) {
      setCategories(savedCategories);
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("passwordVault", JSON.stringify(savedPasswords));
  }, [savedPasswords]);

  useEffect(() => {
    localStorage.setItem("passwordCategories", JSON.stringify(categories));
  }, [categories]);

  const calculateStrength = (password: any) => {
    let score = 0;

    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    if (password.length >= 16) score += 1;

    if (/[a-z]/.test(password)) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^a-zA-Z0-9]/.test(password)) score += 1;

    if (password.length >= 14 && score >= 6) score += 1;

    let label, color;
    if (score <= 2) {
      label = "Very Weak";
      color = "text-red-500";
    } else if (score <= 4) {
      label = "Weak";
      color = "text-orange-500";
    } else if (score <= 6) {
      label = "Good";
      color = "text-yellow-500";
    } else if (score <= 7) {
      label = "Strong";
      color = "text-green-500";
    } else {
      label = "Very Strong";
      color = "text-emerald-500";
    }

    return { score, label, color };
  };

  const generatePassword = async () => {
    setIsGenerating(true);
    setCopySuccess(false);

    await new Promise((resolve) => setTimeout(resolve, 300));

    const lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
    const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numberChars = "0123456789";
    const symbolChars = "!@#$%^&*()_+-=[]{}|;:,.<>?~";

    let characterPool = "";
    let requiredChars = [];

    if (includeLowercase) {
      characterPool += lowercaseChars;
      requiredChars.push(
        lowercaseChars[Math.floor(Math.random() * lowercaseChars.length)]
      );
    }
    if (includeUppercase) {
      characterPool += uppercaseChars;
      requiredChars.push(
        uppercaseChars[Math.floor(Math.random() * uppercaseChars.length)]
      );
    }
    if (includeNumbers) {
      characterPool += numberChars;
      requiredChars.push(
        numberChars[Math.floor(Math.random() * numberChars.length)]
      );
    }
    if (includeSymbols) {
      characterPool += symbolChars;
      requiredChars.push(
        symbolChars[Math.floor(Math.random() * symbolChars.length)]
      );
    }

    if (characterPool === "") {
      setGeneratedPassword("");
      setPasswordStrength({
        score: 0,
        label: "Select options",
        color: "text-gray-500",
      });
      setIsGenerating(false);
      return;
    }

    let password = [...requiredChars];

    for (let i = requiredChars.length; i < passwordLength; i++) {
      const randomIndex = Math.floor(Math.random() * characterPool.length);
      password.push(characterPool[randomIndex]);
    }

    for (let i = password.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [password[i], password[j]] = [password[j], password[i]];
    }

    const finalPassword = password.join("");
    setGeneratedPassword(finalPassword);
    setPasswordStrength(calculateStrength(finalPassword));
    setIsGenerating(false);
  };

  const copyToClipboard = async (text = generatedPassword) => {
    if (text) {
      try {
        await navigator.clipboard.writeText(text);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      } catch (err) {
        console.error("Failed to copy password:", err);
      }
    }
  };

  const savePassword = () => {
    if (!generatedPassword || !saveData.title.trim()) return;

    const passwordEntry = {
      id: Date.now().toString(),
      password: generatedPassword,
      title: saveData.title.trim(),
      username: saveData.username.trim(),
      category: saveData.category,
      notes: saveData.notes.trim(),
      strength: passwordStrength,
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
    };

    setSavedPasswords((prev) => ({
      ...prev,
      [passwordEntry.id]: passwordEntry,
    }));

    setShowSaveModal(false);
    setSaveData({ title: "", username: "", category: "Personal", notes: "" });
  };

  const deletePassword = (id: any) => {
    setSavedPasswords((prev) => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });
  };

  const addCategory = () => {
    if (
      newCategoryName.trim() &&
      !categories.includes(newCategoryName.trim())
    ) {
      setCategories((prev) => [...prev, newCategoryName.trim()]);
      setNewCategoryName("");
    }
  };

  const deleteCategory = (categoryToDelete: any) => {
    if (categories.length > 1) {
      setCategories((prev) => prev.filter((cat) => cat !== categoryToDelete));

      // Move passwords from deleted category to first remaining category
      const newDefaultCategory = categories.find(
        (cat) => cat !== categoryToDelete
      );
      setSavedPasswords((prev) => {
        const updated = { ...prev };
        Object.keys(updated).forEach((id) => {
          if (updated[id].category === categoryToDelete) {
            updated[id].category = newDefaultCategory || "Uncategorized";
          }
        });
        return updated;
      });
    }
  };

  const filteredPasswords = Object.values(savedPasswords).filter((pwd) => {
    const matchesSearch =
      pwd.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pwd.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pwd.notes.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || pwd.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getPasswordsByCategory = () => {
    const grouped: Record<string, PasswordEntry[]> = {};
    categories.forEach((cat) => {
      grouped[cat] = Object.values(savedPasswords).filter(
        (pwd) => pwd.category === cat
      );
    });
    return grouped;
  };

  const getStrengthBarWidth = () => {
    return `${(passwordStrength.score / 8) * 100}%`;
  };

  const getStrengthBarColor = () => {
    if (passwordStrength.score <= 2) return "bg-red-500";
    if (passwordStrength.score <= 4) return "bg-orange-500";
    if (passwordStrength.score <= 6) return "bg-yellow-500";
    if (passwordStrength.score <= 7) return "bg-green-500";
    return "bg-emerald-500";
  };

  useEffect(() => {
    generatePassword();
  }, []);

  const GeneratorView = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="mx-auto w-16 h-16 bg-gradient-to-r from-purple-400 to-indigo-400 rounded-2xl flex items-center justify-center mb-4">
          <Shield className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-white">Password Generator</h1>
        <p className="text-white/70">Create secure passwords instantly</p>
      </div>

      {/* Password Length */}
      <div className="space-y-3">
        <label className="block text-white font-medium">
          Password Length:{" "}
          <span className="text-purple-300">{passwordLength}</span>
        </label>
        <input
          type="range"
          min="6"
          max="50"
          value={passwordLength}
          onChange={(e) => setPasswordLength(Number(e.target.value))}
          className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
        />
      </div>

      {/* Options */}
      <div className="space-y-4">
        <h3 className="text-white font-medium">Character Types</h3>
        <div className="grid grid-cols-2 gap-3">
          {[
            {
              id: "lowercase",
              label: "Lowercase",
              state: includeLowercase,
              setter: setIncludeLowercase,
            },
            {
              id: "uppercase",
              label: "Uppercase",
              state: includeUppercase,
              setter: setIncludeUppercase,
            },
            {
              id: "numbers",
              label: "Numbers",
              state: includeNumbers,
              setter: setIncludeNumbers,
            },
            {
              id: "symbols",
              label: "Symbols",
              state: includeSymbols,
              setter: setIncludeSymbols,
            },
          ].map((option) => (
            <label
              key={option.id}
              className="flex items-center space-x-3 cursor-pointer group"
            >
              <div className="relative">
                <input
                  type="checkbox"
                  checked={option.state}
                  onChange={(e) => option.setter(e.target.checked)}
                  className="sr-only"
                />
                <div
                  className={`w-5 h-5 rounded border-2 transition-all duration-200 ${
                    option.state
                      ? "bg-purple-500 border-purple-500"
                      : "border-white/40 group-hover:border-white/60"
                  }`}
                >
                  {option.state && (
                    <svg
                      className="w-3 h-3 text-white absolute top-0.5 left-0.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
              </div>
              <span className="text-white text-sm group-hover:text-purple-200 transition-colors">
                {option.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Generate Button */}
      <button
        onClick={generatePassword}
        disabled={isGenerating}
        className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 disabled:from-purple-400 disabled:to-indigo-400 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95 flex items-center justify-center space-x-2"
      >
        <RefreshCw
          className={`w-5 h-5 ${isGenerating ? "animate-spin" : ""}`}
        />
        <span>{isGenerating ? "Generating..." : "Generate Password"}</span>
      </button>

      {/* Generated Password */}
      {generatedPassword && (
        <div className="space-y-4">
          <div className="relative">
            <div className="bg-black/20 border border-white/20 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-white/70 text-sm font-medium">
                  Generated Password
                </span>
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-white/60 hover:text-white transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              <div className="font-mono text-white break-all">
                {showPassword
                  ? generatedPassword
                  : "•".repeat(generatedPassword.length)}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => copyToClipboard()}
                  className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-lg transition-all duration-200 ${
                    copySuccess
                      ? "bg-green-500/20 text-green-300"
                      : "bg-white/10 hover:bg-white/20 text-white"
                  }`}
                >
                  <Copy className="w-4 h-4" />
                  <span>{copySuccess ? "Copied!" : "Copy"}</span>
                </button>
                <button
                  onClick={() => setShowSaveModal(true)}
                  className="flex items-center justify-center space-x-2 py-2 px-4 rounded-lg bg-green-500/20 hover:bg-green-500/30 text-green-300 transition-all duration-200"
                >
                  <Save className="w-4 h-4" />
                  <span>Save</span>
                </button>
              </div>
            </div>
          </div>

          {/* Password Strength */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-white/70 text-sm">Password Strength</span>
              <span className={`text-sm font-medium ${passwordStrength.color}`}>
                {passwordStrength.label}
              </span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-500 ${getStrengthBarColor()}`}
                style={{ width: getStrengthBarWidth() }}
              ></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const VaultView = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="mx-auto w-16 h-16 bg-gradient-to-r from-green-400 to-blue-400 rounded-2xl flex items-center justify-center mb-4">
          <Lock className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-white">Password Vault</h1>
        <p className="text-white/70">Manage your saved passwords</p>
      </div>

      {/* Search and Category Management */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-4 h-4" />
          <input
            type="text"
            placeholder="Search passwords..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory("All")}
            className={`px-3 py-1 rounded-full text-sm transition-all ${
              selectedCategory === "All"
                ? "bg-purple-500 text-white"
                : "bg-white/10 text-white/70 hover:bg-white/20"
            }`}
          >
            All ({Object.keys(savedPasswords).length})
          </button>
          {categories.map((category) => {
            const count = Object.values(savedPasswords).filter(
              (pwd) => pwd.category === category
            ).length;
            return (
              <div key={category} className="flex items-center">
                <button
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 py-1 rounded-l-full text-sm transition-all ${
                    selectedCategory === category
                      ? "bg-purple-500 text-white"
                      : "bg-white/10 text-white/70 hover:bg-white/20"
                  }`}
                >
                  {category} ({count})
                </button>
                {editingCategory === category ? (
                  <div className="flex items-center bg-white/10 rounded-r-full">
                    <input
                      type="text"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      className="bg-transparent text-white text-sm px-2 py-1 w-20 focus:outline-none"
                      placeholder="New name"
                    />
                    <button
                      onClick={() => {
                        if (newCategoryName.trim()) {
                          setCategories((prev) =>
                            prev.map((cat) =>
                              cat === category ? newCategoryName.trim() : cat
                            )
                          );
                          setEditingCategory(null);
                          setNewCategoryName("");
                        }
                      }}
                      className="text-green-400 hover:text-green-300 px-1"
                    >
                      ✓
                    </button>
                    <button
                      onClick={() => {
                        setEditingCategory(null);
                        setNewCategoryName("");
                      }}
                      className="text-red-400 hover:text-red-300 px-1"
                    >
                      ✗
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center bg-white/10 rounded-r-full">
                    <button
                      onClick={() => {
                        setEditingCategory(category);
                        setNewCategoryName(category);
                      }}
                      className="text-white/60 hover:text-white/80 px-1"
                    >
                      <Edit3 className="w-3 h-3" />
                    </button>
                    {categories.length > 1 && (
                      <button
                        onClick={() => deleteCategory(category)}
                        className="text-red-400 hover:text-red-300 px-1"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="New category name"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            onClick={addCategory}
            className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-all flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add</span>
          </button>
        </div>
      </div>

      {/* Password List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {filteredPasswords.length === 0 ? (
          <div className="text-center py-8 text-white/60">
            <FolderOpen className="w-12 h-12 mx-auto mb-4 text-white/40" />
            <p>No passwords found</p>
            <p className="text-sm">
              Generate and save some passwords to get started
            </p>
          </div>
        ) : (
          filteredPasswords.map((pwd) => (
            <div
              key={pwd.id}
              className="bg-white/10 border border-white/20 rounded-xl p-4 space-y-3"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-white font-medium">{pwd.title}</h3>
                  {pwd.username && (
                    <p className="text-white/70 text-sm">
                      Username: {pwd.username}
                    </p>
                  )}
                  <p className="text-white/60 text-xs">
                    Category: {pwd.category} | Created:{" "}
                    {new Date(pwd.createdAt).toLocaleDateString()}
                  </p>
                  {pwd.notes && (
                    <p className="text-white/60 text-sm mt-1">{pwd.notes}</p>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${pwd.strength.color
                      .replace("text-", "bg-")
                      .replace("-500", "-500/20")} ${pwd.strength.color}`}
                  >
                    {pwd.strength.label}
                  </span>
                  <button
                    onClick={() => copyToClipboard(pwd.password)}
                    className="text-white/60 hover:text-white transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deletePassword(pwd.id)}
                    className="text-red-400 hover:text-red-300 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="font-mono text-white/80 text-sm bg-black/20 rounded-lg p-2 break-all">
                {pwd.password}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-40 left-1/2 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse animation-delay-4000"></div>
      </div>

      {/* Main container */}
      <div className="relative backdrop-blur-lg bg-white/10 border border-white/20 rounded-3xl shadow-2xl w-full max-w-2xl p-8 space-y-6">
        {/* Navigation */}
        <div className="flex space-x-2 bg-white/10 p-1 rounded-xl">
          <button
            onClick={() => setCurrentView("generator")}
            className={`flex-1 py-2 px-4 rounded-lg transition-all flex items-center justify-center space-x-2 ${
              currentView === "generator"
                ? "bg-purple-500 text-white"
                : "text-white/70 hover:text-white hover:bg-white/10"
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Generator</span>
          </button>
          <button
            onClick={() => setCurrentView("vault")}
            className={`flex-1 py-2 px-4 rounded-lg transition-all flex items-center justify-center space-x-2 ${
              currentView === "vault"
                ? "bg-purple-500 text-white"
                : "text-white/70 hover:text-white hover:bg-white/10"
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>Vault ({Object.keys(savedPasswords).length})</span>
          </button>
        </div>

        {/* Content */}
        {currentView === "generator" ? <GeneratorView /> : <VaultView />}

        {/* Save Password Modal */}
        {showSaveModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 w-full max-w-md space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-white">Save Password</h3>
                <button
                  onClick={() => setShowSaveModal(false)}
                  className="text-white/60 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Password title (required)"
                  value={saveData.title}
                  onChange={(e) =>
                    setSaveData((prev) => ({ ...prev, title: e.target.value }))
                  }
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />

                <input
                  type="text"
                  placeholder="Username (optional)"
                  value={saveData.username}
                  onChange={(e) =>
                    setSaveData((prev) => ({
                      ...prev,
                      username: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />

                <select
                  value={saveData.category}
                  onChange={(e) =>
                    setSaveData((prev) => ({
                      ...prev,
                      category: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat} className="bg-gray-800">
                      {cat}
                    </option>
                  ))}
                </select>

                <textarea
                  placeholder="Notes (optional)"
                  value={saveData.notes}
                  onChange={(e) =>
                    setSaveData((prev) => ({ ...prev, notes: e.target.value }))
                  }
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                  rows={3}
                />
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowSaveModal(false)}
                  className="flex-1 py-3 px-4 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={savePassword}
                  disabled={!saveData.title.trim()}
                  className="flex-1 py-3 px-4 bg-green-500 hover:bg-green-600 disabled:bg-green-500/50 text-white rounded-xl transition-all disabled:cursor-not-allowed"
                >
                  Save Password
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(45deg, #a855f7, #6366f1);
          cursor: pointer;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
        }

        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(45deg, #a855f7, #6366f1);
          cursor: pointer;
          border: none;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default PasswordGenerator;
