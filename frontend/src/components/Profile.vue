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
        <h3 class="text-sm text-yellow-500 font-semibold mb-2">Reviews</h3>
        <ul>
          <li v-for="review in reviews" :key="review.id" class="flex items-center gap-3 mb-3 cursor-pointer">
            <img :src="review.moviePoster" alt="Movie Poster" class="w-10 h-10 rounded-full object-cover" />
            <div class="flex justify-between w-full">
              <router-link :to="`/movie/${review.movieId}`">
                <h4 class="text-white text-sm hover:opacity-75 transition-opacity duration-200">{{ review.movieTitle }}
                </h4>
              </router-link>
              <button @click="showReviewPopup(review)"
                class="bg-yellow-500 text-black px-3 text-xs rounded-lg hover:bg-yellow-400 transition duration-200">
                Review
              </button>
            </div>
          </li>
        </ul>
      </div>

      <!-- Full Review Pop-up -->
      <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div class="bg-gray-800 p-6 rounded-lg w-96">
          <h3 class="text-xl text-yellow-500 mb-4">{{ selectedReview.movieTitle }}</h3>
          <p class="text-white text-sm mb-4">Rating: {{ selectedReview.rating }}</p>
          <p class="text-white text-sm mb-4">{{ selectedReview.body }}</p>
          <button @click="closeModal"
            class="bg-yellow-500 text-black py-1 px-3 text-xs rounded-lg hover:bg-yellow-400 transition duration-200">
            Close
          </button>
        </div>
      </div>

      <!-- Full Review Pop-up -->
      <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div class="bg-gray-800 p-6 rounded-lg w-96">
          <h3 class="text-2xl text-yellow-500 mb-4">{{ selectedReview.movieTitle }}</h3>
          <p class="text-white mb-4">Rating: {{ selectedReview.rating }}</p>
          <p class="text-white mb-4">{{ selectedReview.body }}</p>
          <button @click="closeModal"
            class="bg-yellow-500 text-black py-2 px-4 rounded-lg hover:bg-yellow-400 transition duration-200">
            Close
          </button>
        </div>
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
          <li v-for="list in lists" :key="list.id" @click="showListMovies(list)"
            class="flex items-center gap-3 mb-3 cursor-pointer">
            <div v-if="!list.movies?.length"
              class="w-8 h-8 rounded-full flex justify-center items-center bg-gray-600 text-white">
              <i class="fas fa-list"></i>
            </div>
            <img v-else :src="list.movies[0].moviePoster" alt="List Image" class="w-8 h-8 rounded-full object-cover" />
            <span>{{ list.name }}</span>
            <!-- Add a remove button for the list -->
            <button @click.stop="deleteList(list.id)" class="ml-auto text-red-500 hover:text-red-300">
              <i class="fas fa-trash-alt"></i>
            </button>
          </li>
        </ul>
      </div>

      <!-- Add List Button -->
      <button @click="showCreateListModal = true"
        class="bg-yellow-500 text-black px-4 py-2 text-sm rounded-lg hover:bg-yellow-400 transition duration-200 mt-3">
        Create New List
      </button>

      <!-- Modal for creating a new list -->
      <div v-if="showCreateListModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div class="bg-gray-800 p-6 rounded-lg w-96">
          <h3 class="text-2xl text-yellow-500 mb-4">Create a New List</h3>
          <input v-model="newListName" type="text" placeholder="Enter list name"
            class="w-full bg-gray-700 p-3 rounded-lg text-white text-sm mb-4" />
          <div class="flex justify-end gap-4">
            <button @click="showCreateListModal = false"
              class="bg-gray-600 text-white py-1 px-3 text-sm rounded-lg hover:bg-gray-500 transition duration-200">
              Cancel
            </button>
            <button @click="createList"
              class="bg-yellow-500 text-black py-1 px-3 text-sm rounded-lg hover:bg-yellow-400 transition duration-200">
              Create
            </button>
          </div>
        </div>
      </div>


      <!-- Movie List Modal -->
      <div v-if="showMovieListModal && selectedListMovies.length > 0"
        class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div class="bg-gray-800 p-6 rounded-lg w-96">
          <h3 class="text-2xl text-yellow-500 mb-4">{{ selectedList.name }} Movies</h3>
          <ul>
            <li v-for="movie in selectedListMovies" :key="movie._id" class="flex items-center gap-3 mb-3">
              <img :src="movie.moviePoster || '/default-movie-poster.jpg'" alt="Movie Poster"
                class="w-10 h-10 rounded-full object-cover" />
              <span class="flex-1">{{ movie.title }}</span>
              <button @click="deleteMovie(selectedList.id, movie._id)"
                class="bg-red-500 text-white py-1 px-3 text-xs rounded-lg hover:bg-red-400 transition duration-200">
                Delete
              </button>
            </li>
          </ul>
          <button @click="showMovieListModal = false"
            class="bg-yellow-500 text-black py-1 px-3 text-xs rounded-lg hover:bg-yellow-400 transition duration-200">
            Close
          </button>
        </div>
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
      showMovieListModal: false,
      selectedList: {},
      selectedListMovies: [],
      images: [],
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
      lists: [],
      showCreateListModal: false,
      newListName: '',
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
            movieId: review.movie.TMDid,
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
    async fetchLists() {
      try {
        const userId = localStorage.getItem("userId");
        const response = await fetch("http://localhost:5001/api/lists/user-lists/" + userId);
        const data = await response.json();

        // Fetch movie posters for each list
        const listsWithImages = await Promise.all(data.map(async (list) => {
          const moviesWithPosters = await Promise.all(list.movies.map(async (movie) => {
            const movieResponse = await fetch(`http://localhost:5001/api/moviesdb/movie/${movie.TMDid}/images`);
            const movieData = await movieResponse.json();

            // Get the poster image or use a default if none found
            const moviePoster = `https://image.tmdb.org/t/p/w200${movieData.backdrops?.[0]?.file_path || movie.poster || '/default-movie-poster.jpg'}`;

            return {
              ...movie,
              moviePoster,
            };
          }));

          return {
            id: list._id,
            name: list.name,
            movies: moviesWithPosters, // Updated movies array with posters
          };
        }));


        // Assign the updated lists with movie posters
        this.lists = listsWithImages;

      } catch (error) {
        console.error(error);
      }
    },
    deleteList(listId) {
      try {
        fetch(`http://localhost:5001/api/lists/delete/${listId}`, {
          method: "DELETE",
        });

        // Remove the list from the UI
        this.lists = this.lists.filter((list) => list.id !== listId);

      } catch (error) {
        console.error(error);
      }
    },
    async deleteMovie(listId, movieId) {
    console.log(listId, movieId);
      try {
        // Send delete request to the server
        await fetch(`http://localhost:5001/api/lists/remove-movie/`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            listId,
            movieId,
          }),
        });

        // Update local state
        this.selectedListMovies = this.selectedListMovies.filter(movie => movie._id !== movieId);

        // Optionally, update the main lists array
        const listIndex = this.lists.findIndex(list => list.id === listId);
        if (listIndex !== -1) {
          this.lists[listIndex].movies = this.lists[listIndex].movies.filter(movie => movie._id !== movieId);
        }
      } catch (error) {
        console.error("Error deleting movie:", error);
      }
    },
    async createList() {
      if (!this.newListName.trim()) {
        alert("List name cannot be empty.");
        return;
      }

      const userId = localStorage.getItem("userId");

      if (!userId) {
        alert("User is not logged in.");
        return;
      }

      try {
        const response = await fetch("http://localhost:5001/api/lists/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: this.newListName,
            userId: userId,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to create the list.");
        }

        const newList = await response.json();

        // Update lists in UI
        this.lists.push({
          id: newList._id,
          name: newList.name,
          movies: [],
        });

        // Reset form and close modal
        this.newListName = "";
        this.showCreateListModal = false;
      } catch (error) {
        console.error("Error creating list:", error);
        alert("An error occurred while creating the list.");
      }
    },
    showListMovies(list) {
      this.selectedList = list;
      this.selectedListMovies = list.movies;
      this.showMovieListModal = true;
    },
    showReviewPopup(review) {
      this.selectedReview = review;
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
      this.showMovieListModal = false;
    },
    submitPost() {
      console.log(this.postContent);
    },
  },
  mounted() {
    this.fetchReviews();
    this.fetchLists();
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
