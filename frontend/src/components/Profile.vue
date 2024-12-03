<template>
  <div class="min-h-screen bg-gray-900 text-white flex font-[poppins]">
    <!-- Sidebar -->
    <aside class="w-72 bg-gray-800 p-6 mt-20 flex flex-col gap-8">

      <!-- Profile Section -->
      <div class="bg-gray-700 p-6 rounded-lg text-center relative overflow-hidden">
        <!-- Background Image -->
        <div class="absolute top-0 left-0 w-full h-20 bg-cover bg-center"
          style="background-image: url('/background-pattern.png');"></div>

        <!-- Profile Picture -->
        <div class="relative w-24 h-24 mx-auto flex justify-center items-center mt-8">
          <img src="/alex.png" alt="User" class="rounded-lg border-2 border-yellow-400" />
        </div>

        <!-- Follower and Following Stats -->
        <div class="flex justify-between text-sm mt-4">
          <div class="flex flex-col items-center">
            <span class="text-yellow-400 text-lg">1984</span>
            <span class="text-gray-400">Followers</span>
          </div>
          <div class="flex flex-col items-center">
            <span class="text-yellow-400 text-lg">1002</span>
            <span class="text-gray-400">Following</span>
          </div>
        </div>

        <!-- Profile Details -->
        <h2 class="mt-4 text-lg font-semibold">AlExMDi</h2>
        <p class="text-sm text-gray-400">@alexmdi</p>
        <p class="mt-2 text-sm text-gray-300">
          ✨ Hi, I'm a movie lover! ✨
        </p>
      </div>

      <!-- Reviews -->
      <div>
        <h3 class="text-lg text-yellow-500 font-semibold mb-2">Reviews</h3>
        <ul>
          <li v-for="review in reviews" :key="review.id" class="flex items-center gap-3 mb-3 cursor-pointer"
            @click="showReviewPopup(review)">
            <!-- Circular Movie Poster -->
            <img :src="review.moviePoster" alt="Movie Poster" class="w-12 h-12 rounded-full object-cover" />
            <div>
              <h4 class="text-white">{{ review.movieTitle }}</h4>
            </div>
          </li>
        </ul>
      </div>

      <!-- Full Review Pop-up -->
      <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div class="bg-gray-800 p-6 rounded-lg w-96">
          <h3 class="text-2xl text-yellow-500 mb-4">{{ selectedReview.movieTitle }}</h3>
          <p class="text-white mb-4">Rating: {{ selectedReview.rating }}</p>
          <p class="text-white mb-4">{{ selectedReview.body }}</p>
          <button @click="closeModal" class="text-yellow-400 mt-4 hover:underline">Close</button>
        </div>
      </div>

      <!-- Lists -->
      <div>
        <h3 class="text-lg text-yellow-500 font-semibold mt-6 mb-2">Lists</h3>
        <ul>
          <li class="flex items-center gap-3 mb-3">
            <div class="w-8 h-8 bg-gray-600 rounded-full"></div>
            <span>To Watch</span>
          </li>
          <li class="flex items-center gap-3">
            <div class="w-8 h-8 bg-gray-600 rounded-full"></div>
            <span>Not Recommended</span>
          </li>
        </ul>
      </div>

    </aside>

    <!-- Main Feed -->
    <main class="flex-1 p-6">
      <!-- Post Input -->
      <div class="bg-gray-800 p-4 rounded-lg mt-14 mb-6 relative">
        <div class="flex items-center gap-4">
          <img src="/alex.png" alt="User" class="w-12 h-12 rounded-full" />
          <textarea v-model="postContent" placeholder="What's on your mind?"
            class="w-full bg-gray-700 p-3 rounded-lg text-white text-sm resize-none"></textarea>
        </div>

        <div class="flex justify-center items-center mt-3 space-x-4">
          <button
            class="flex items-center gap-2 bg-neutral-800 text-white px-5 py-2 rounded-lg font-medium hover:bg-yellow-500 transition">
            <img src="/camera.svg" class="w-5 h-5" alt="Smiley" />
            Photo
          </button>
          <button
            class="flex items-center gap-2 bg-neutral-800 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-500 transition">
            <img src="/video.svg" class="w-5 h-5" />
            Video
          </button>
          <button
            class="flex items-center gap-2 bg-neutral-800 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-500 transition">
            <img src="/poll.svg" class="w-5 h-5" />
            Poll
          </button>
        </div>

        <div class="absolute right-4 bottom-4">
          <button class="bg-yellow-400 px-6 py-2 text-black rounded-lg">
            Post
          </button>
        </div>
      </div>

      <!-- Posts -->
      <div v-for="post in posts" :key="post.id" class="bg-gray-800 p-4 rounded-lg mb-6">
        <div class="flex items-center gap-4 mb-4">
          <img :src="post.userImage" alt="User" class="w-12 h-12 rounded-full" />
          <div>
            <h3 class="font-semibold">{{ post.userName }}</h3>
            <p class="text-sm text-gray-400">{{ post.time }}</p>
          </div>
        </div>
        <p class="text-gray-300">{{ post.content }}</p>
        <img v-if="post.image" :src="post.image" alt="Post" class="mt-4 rounded-lg" />
        <div class="flex items-center gap-8 text-gray-500 mt-4">
          <span>❤️ {{ post.likes }}</span>
          <span>💬 {{ post.comments }}</span>
          <span>🔄 {{ post.shares }}</span>
        </div>
      </div>
    </main>

    <!-- Right Sidebar -->
    <aside class="w-72 bg-gray-800 p-6 mt-20 flex flex-col gap-8">
      <!-- Recent Activity -->
      <div>
        <h3 class="text-lg font-semibold mb-4">My Activity</h3>
        <ul class="space-y-4">
          <li v-for="activity in activities" :key="activity.id" class="bg-gray-700 p-4 rounded-lg flex flex-col">
            <div>
              <p class="text-sm font-semibold">{{ activity.name }}</p>
              <p class="text-sm text-gray-400">{{ activity.time }}</p>
            </div>
            <!-- Move action text below the user info -->
            <p class="text-sm text-yellow-400 mt-2">
              {{ activity.action }}
            </p>
          </li>
        </ul>
      </div>
    </aside>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showModal: false,
      selectedReview: {},
      images: [],
      stories: [
        { id: 1, name: "Lucas", image: "/lucas.png" },
        { id: 2, name: "David", image: "/david.png" },
      ],
      posts: [
        {
          id: 1,
          userName: "Daniel Garvi",
          time: "1 hr ago",
          content: "In some cases, you may see...",
          image: "/dune.jpeg",
          userImage: "/dani.png",
          likes: 20,
          comments: 5,
          shares: 2,
        },
      ],
      activities: [
        {
          id: 1,
          time: "3 min ago",
          action: "Watched the film 'Inception'"
        },
        {
          id: 2,
          time: "1 hr ago",
          action: "Like the film 'The Matrix'"
        },
        {
          id: 3,
          time: "2 hrs ago",
          action: "Disliked the film 'Avatar'"
        },
        {
          id: 4,
          time: "5 hrs ago",
          action: "Post about the film 'Dune II'"
        }
      ],
      postContent: "",
      reviews: [],
    }
  },

  methods: {
    async fetchReviews() {
      try {
        const userId = localStorage.getItem("userId");
        const response = await fetch("http://localhost:5001/api/reviews/user/reviews?userId=" + userId);
        const data = await response.json();

        // Loop through the reviews and fetch movie posters for each review
        const reviewsWithImages = await Promise.all(data.map(async (review, index) => {
          const movieResponse = await fetch(`http://localhost:5001/api/moviesdb/movie/${review.movie.TMDid}/images`);
          const movieData = await movieResponse.json();

          const moviePoster = `https://image.tmdb.org/t/p/w200${movieData.backdrops?.[0]?.file_path || ''}`;

          return {
            id: index,
            movieTitle: review.movie.title,
            rating: review.rating,
            body: review.body,
            moviePoster,
          };
        }));

        // Assign the updated reviews with movie posters to the data
        this.reviews = reviewsWithImages;

      } catch (error) {
        console.error(error);
      }
    },

    showReviewPopup(review) {
      this.selectedReview = review;
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    },
    submitPost() {
      console.log(this.postContent);
    },
  },
  mounted() {
    this.fetchReviews()
  },
};
</script>

<style scoped>
textarea {
  word-wrap: break-word;
  word-break: break-word;
  resize: none;
}
</style>
