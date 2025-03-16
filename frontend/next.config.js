// const nextConfig = {
//   env: {
//     //If you wan to run your local api folder then need to comment this below line
//     //API_URL: "https://bigdeal-api-git-main-pixelstrapthemes.vercel.app/",

//     //If you wan to run your local api folder then need to uncomment this below line
//     // API_URL: "http://localhost:8000/graphql",
//   },
//   webpack(config) {
//     config.module.rules.push({
//       test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
//       use: {
//         loader: "url-loader",
//         options: {
//           limit: 100000,
//         },
//       },
//     });

//     return config;
//   },
// };

// module.exports = nextConfig;


// const nextConfig = {
//   env: {
//     API_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000", // Replace with actual API URL
//   },
//   webpack(config) {
//     config.module.rules.push({
//       test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
//       use: {
//         loader: "url-loader",
//         options: {
//           limit: 100000,
//         },
//       },
//     });

//     return config;
//   },
// };

// module.exports = nextConfig;

const nextConfig = {
  env: {
    // Use the dynamic environment variable for the API URL
    API_URL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000", // Local fallback to port 5000
  },
  webpack(config) {
    // Handling image and font loading
    config.module.rules.push({
      test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
      use: {
        loader: "url-loader",
        options: {
          limit: 100000,
        },
      },
    });

    return config;
  },
};

module.exports = nextConfig;


