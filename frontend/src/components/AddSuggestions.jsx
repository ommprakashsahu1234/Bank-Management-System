import React, { useState } from "react";

function AddSuggestions() {
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);
    const object = {};
    formData.forEach((value, key) => {
      object[key] = value;
    });
    const json = JSON.stringify(object);

    setLoading(true);
    setResult("Please wait...");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: json,
      });

      const data = await response.json();

      if (response.status === 200) {
        setResult("Feedback/Complaint Sent");
      } else {
        setResult(data.message || "Something went wrong!");
      }
    } catch (error) {
      console.error(error);
      setResult("Something went wrong!");
    } finally {
      setLoading(false);
      form.reset();
      setTimeout(() => setResult(""), 5000);
    }
  };

  return (
    <div className="flex items-center min-h-screen bg-gray-900">
      <div className="container mx-auto">
        <div className="max-w-md mx-auto my-10 bg-gray-800 p-5 rounded-md shadow-sm">
          <div className="text-center">
            <h1 className="my-3 text-3xl font-semibold text-gray-100">
              Add Suggestion
            </h1>
          </div>
          <div className="m-7">
            <form onSubmit={handleSubmit}>
              <input
                type="hidden"
                name="access_key"
                value="20c20add-3b60-484a-a6d4-4660e1f87cf7"
              />
              <input
                type="hidden"
                name="subject"
                value="New Suggestion for Bank Management System."
              />
              <input type="checkbox" name="botcheck" className="hidden" />

              <div className="mb-6">
                <label
                  htmlFor="name"
                  className="block mb-2 text-sm text-gray-400"
                >
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  placeholder="Name"
                  required
                  className="w-full px-3 py-2 h-12 rounded-sm placeholder-gray-500 text-gray-900 bg-gray-100 text-sm focus:outline-none"
                />
              </div>

              <div className="mb-6">
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm text-gray-400"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Email Address"
                  required
                  className="w-full px-3 py-2 h-12 rounded-sm placeholder-gray-500 text-gray-900 bg-gray-100 text-sm focus:outline-none"
                />
              </div>

              <div className="mb-6">
                <label
                  htmlFor="suggestion"
                  className="block mb-2 text-sm text-gray-400"
                >
                  Your Suggestion/s
                </label>
                <textarea
                  rows="5"
                  name="suggestion"
                  id="suggestion"
                  placeholder="Your Suggestion/s"
                  className="w-full px-3 py-2 rounded-sm placeholder-gray-500 text-gray-900 bg-gray-100 text-sm focus:outline-none"
                  required
                ></textarea>
              </div>

              <div className="mb-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-indigo-600 text-white py-4 px-4 rounded-sm hover:bg-indigo-700 focus:outline-none"
                >
                  {loading ? "Sending..." : "Send Message"}
                </button>
              </div>

              {result && (
                <p className="text-base text-center text-green-500">{result}</p>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddSuggestions;
