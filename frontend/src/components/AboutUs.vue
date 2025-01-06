<template>
  <div class="about-us">
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-content">
        <h1>CineTrunk</h1>
        <p>
          A social network for movie buffs where you can share your reviews, manage your movie lists and
          discover new content.
        </p>
        <router-link to="/register">
          <button class="cta-button" aria-label="Únete a CineTrunk">
            Join now
          </button>
        </router-link>
        <router-link to="/login">
          <button class="cta-button" aria-label="Inicia sesión en CineTrunk">
            Log in
          </button>
        </router-link>
      </div>
    </section>

    <!-- Mission, Vision, Values -->
    <section v-if="philosophy.length" class="mission-vision-values" id="mission-vision-values">
      <h2>Our philosophy</h2>
      <div class="section-content">
        <div v-for="(item, index) in philosophy" :key="index" class="card">
          <h3>{{ item.title }}</h3>
          <p>{{ item.description }}</p>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section v-if="features.length" class="features" id="features">
      <h2>What can you do in CineTrunk?</h2>
      <div class="features-grid">
        <div v-for="(feature, index) in features" :key="index" class="feature-card">
          <i :class="feature.icon" aria-hidden="true"></i>
          <h3>{{ feature.title }}</h3>
          <p>{{ feature.description }}</p>
        </div>
      </div>
    </section>

    <!-- Fast Facts -->
    <section v-if="facts.length" class="fast-facts">
      <h2>Key Facts</h2>
      <div class="facts-grid">
        <div v-for="(fact, index) in facts" :key="index" class="fact-card">
          <h3 class="animated-counter" :data-value="fact.value">{{ fact.value }}</h3>
          <p>{{ fact.text }}</p>
        </div>
      </div>
    </section>

    <!-- Testimonials -->
    <section class="conversation" id="conversation">
      <h2 class="text-center">Introducing CineTrunk</h2>
      <div class="conversation-container">
        <div v-for="(message, index) in messages" :key="index"
          :class="['chat-bubble', message.author, { visible: index <= currentIndex }]">
          <p v-html="message.text"></p>
        </div>
      </div>
    </section>

    <!-- Call to Action -->
    <section class="call-to-action" id="call-to-action">
      <h2>Ready to join CineTrunk?</h2>
      <p>Start managing your favorite movies and connect with other movie buffs.</p>
      <router-link to="/login">
        <button class="cta-button" @click="scrollToSection('features')" aria-label="Comienza a explorar CineTrunk">
          Get Started
        </button>
      </router-link>
    </section>
  </div>
</template>


<script>
import router from '../router';

export default {
  data() {
    return {
      philosophy: [
        { title: "Purpose", description: "Offer a unique experience that combines the functionalities of a social network with the love of cinema." },
        { title: "Vision", description: "To become the reference space for passionate film buffs from all over the world." },
        { title: "Values", description: "Community, Creativity and Connection" },
      ],
      features: [
        { icon: "fa-solid fa-film", title: "Films management", description: "Create lists of movies and organize them as you want" },
        { icon: "fa-solid fa-users", title: "Community", description: "Connect with other movie lovers and discover content you'll love." },
      ],
      facts: [
        { value: 50000, text: "Reviews shared about films" },
        { value: 20000, text: "Custom movie lists" },
        { value: 10000, text: "Global Users" },
      ],
      messages: [
        { text: "Hey! Have you checked out CineTrunk?", author: "alice" },
        { text: "CineTrunk? What’s that?", author: "bob" },
        {
          text: "It’s this cool platform where you can log all the movies you’ve seen, rate them, and even track your favorites! 🎥✨",
          author: "alice",
        },
        { text: "Wait, that sounds amazing! I always forget the movies I watch.", author: "bob" },
        {
          text: 'Here’s what I’m saying: <br><img src="https://media.giphy.com/media/movienight/giphy.gif" alt="Movie Night Forever GIF">',
          author: "alice",
        },
        { text: "Haha, perfect. Thanks for the rec! I’m signing up now. 🎬", author: "bob" },
      ],
      // team: [
      //   { name: "Alexander Morales", role: "Co-fundador, Estrategia y Desarrollo", image: "/alex.png", links: [{ url: "https://linkedin.com", icon: "fa-brands fa-linkedin" }, { url: "https://twitter.com", icon: "fa-brands fa-twitter" }] },
      //   { name: "Daniel Garvi", role: "Co-fundador, Tecnología y Producto", image: "/dani.png", links: [{ url: "https://linkedin.com", icon: "fa-brands fa-linkedin" }, { url: "https://twitter.com", icon: "fa-brands fa-twitter" }] },
      // ],
      contactForm: {
        name: "",
        email: "",
        message: "",
      },
      currentIndex: -1,
    };
  },
  methods: {
    prevSlide() {
      this.currentIndex = (this.currentIndex - 1 + this.testimonials.length) % this.testimonials.length;
    },
    nextSlide() {
      this.currentIndex = (this.currentIndex + 1) % this.testimonials.length;
    },
    goToSlide(index) {
      this.currentIndex = index;
    },
    scrollToSection(id) {
      document.getElementById(id).scrollIntoView({ behavior: "smooth" });
    },
    handleSubmit() {
      alert("Gracias por tu mensaje. Nos pondremos en contacto contigo pronto.");
      this.contactForm = { name: "", email: "", message: "" };
    },
    animateMessages() {
      // Incrementally reveal chat bubbles
      this.messages.forEach((_, i) => {
        setTimeout(() => {
          this.currentIndex = i;
        }, i * 1000); // Each bubble appears after 1 second
      });
    },
    observeSection() {
      const conversationSection = document.querySelector(".conversation");
      if (!conversationSection) return;

      const observer = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              // Start animating messages when the section is in view
              this.animateMessages();
              observer.disconnect(); // Stop observing once animation starts
            }
          });
        },
        { threshold: 0.2 } // Trigger when 20% of the section is visible
      );

      observer.observe(conversationSection);
    },
  },
  mounted() {
    this.observeSection();
  },
};
</script>


<style scoped>
.about-us {
  font-family: 'Poppins', sans-serif;
  color: #d4d7e5;
  line-height: 1.6;
}

/* Utility Classes */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

/* Hero Section */
.hero {
  background: linear-gradient(to right, #0b101a, #1a2b3f);
  color: #e9ecef;
  text-align: center;
  padding: 6rem 2rem;
}

.hero-content {
  max-width: 800px;
  margin: 0 auto;
}

.hero-content h1 {
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 1rem;
  color: #ffd700;
}

.hero-content p {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  line-height: 1.8;
}

.cta-button {
  margin-right: 1rem;
  background: #ffd700;
  color: #0b101a;
  border: none;
  padding: 0.8rem 2rem;
  font-size: 1rem;
  font-weight: bold;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cta-button:hover {
  background: #ffe066;
  box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.2);
}

/* Mission, Vision, Values */
.mission-vision-values {
  background: #161d2f;
  padding: 4rem 2rem;
}

.mission-vision-values h2 {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 2rem;
  color: #ffd700;
}

.section-content {
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  flex-wrap: wrap;
}

.card {
  background: #1f2937;
  border-radius: 10px;
  padding: 2rem;
  width: 280px;
  text-align: center;
  color: #d4d7e5;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
  transform: translateY(-10px);
  box-shadow: 0 12px 20px rgba(0, 0, 0, 0.15);
}

.card h3 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #ffd700;
}

/* Features Section */
.features {
  padding: 4rem 2rem;
  background: #0b101a;
  color: #e9ecef;
}

.features h2 {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 2rem;
  color: #ffd700;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.feature-card {
  background: #1f2937;
  padding: 2rem;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-10px);
}

.feature-card i {
  font-size: 2rem;
  margin-bottom: 1rem;
  color: #ffd700;
}

.feature-card h3 {
  font-size: 1.25rem;
  margin-bottom: 1rem;
}

/* Fast Facts Section */
.fast-facts {
  padding: 4rem 2rem;
  background: #161d2f;
}

.facts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.fact-card {
  background: #1f2937;
  color: #d4d7e5;
  padding: 2rem;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.fact-card:hover {
  transform: scale(1.05);
}

.fact-card h3 {
  font-size: 2rem;
  margin-bottom: 1rem;
  color: #ffd700;
}

/* Leadership Section */
.leadership {
  padding: 4rem 2rem;
}

.team-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.team-member {
  text-align: center;
}

.team-member img {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  margin-bottom: 1rem;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
}

.team-member h3 {
  margin-bottom: 0.5rem;
  color: #ffd700;
}

/* Call-to-Action Section */
.call-to-action {
  background: linear-gradient(to right, #0b101a, #1a2b3f);
  text-align: center;
  padding: 4rem 2rem;
}

.call-to-action h2 {
  font-size: 2rem;
  margin-bottom: 1rem;
  color: #ffd700;
}

.call-to-action p {
  font-size: 1.25rem;
  margin-bottom: 2rem;
}

.call-to-action button {
  background: #ffd700;
  color: #0b101a;
  padding: 0.8rem 2rem;
  border: none;
  border-radius: 25px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
}

.call-to-action button:hover {
  background: #ffe066;
}

.testimonials {
  padding: 4rem 2rem;
  background: #0b101a;
  text-align: center;
  color: #d4d7e5;
}

.testimonials h2 {
  font-size: 2.5rem;
  color: #ffd700;
  margin-bottom: 2rem;
}

.testimonial-slider {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.testimonial-cards {
  overflow: hidden;
  width: 100%;
  max-width: 800px;
  position: relative;
}

.testimonial-card {
  display: none;
  background: #1f2937;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  transition: opacity 0.3s ease;
}

.testimonial-card.active {
  display: block;
  opacity: 1;
}

.testimonial-card p {
  font-size: 1.2rem;
  line-height: 1.8;
  margin-bottom: 1rem;
  color: #e9ecef;
}

.testimonial-card h4 {
  font-size: 1rem;
  color: #ffd700;
}

.slider-button {
  background: transparent;
  border: none;
  font-size: 2rem;
  color: #ffd700;
  cursor: pointer;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  transition: color 0.3s ease;
}

.slider-button:hover {
  color: #ffe066;
}

.slider-button.prev {
  left: -2rem;
}

.slider-button.next {
  right: -2rem;
}

.dots {
  margin-top: 1rem;
}

.dots span {
  display: inline-block;
  width: 10px;
  height: 10px;
  margin: 0 5px;
  background: #d4d7e5;
  border-radius: 50%;
  cursor: pointer;
  transition: background 0.3s ease;
}

.dots span.active {
  background: #ffd700;
}

.leadership {
  padding: 4rem 2rem;
  background: #0b101a;
  text-align: center;
  color: #d4d7e5;
}

.leadership h2 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: #ffd700;
}

.leadership-description {
  font-size: 1.2rem;
  margin-bottom: 3rem;
  color: #e9ecef;
}

.team-grid {
  display: flex;
  justify-content: center;
  gap: 2rem;
  flex-wrap: wrap;
}

.team-member {
  background: #1f2937;
  border-radius: 15px;
  padding: 1.5rem;
  width: 300px;
  text-align: center;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.team-member:hover {
  transform: translateY(-10px);
  box-shadow: 0 12px 20px rgba(0, 0, 0, 0.3);
}

.team-photo-wrapper {
  position: relative;
  margin-bottom: 1rem;
  width: 120px;
  height: 120px;
  margin: 0 auto;
  border-radius: 50%;
  overflow: hidden;
  border: 4px solid #ffd700;
}

.team-photo-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.team-member h3 {
  font-size: 1.5rem;
  margin: 1rem 0 0.5rem;
  color: #ffd700;
}

.team-member p {
  font-size: 1rem;
  color: #e9ecef;
  margin-bottom: 1.5rem;
}

.social-links {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.social-links a {
  font-size: 1.5rem;
  color: #ffd700;
  transition: color 0.3s ease;
}

.social-links a:hover {
  color: #ffe066;
}


.contact {
  background-color: #1f2937;
  /* Matches the main color palette */
  color: #2e2e2e;
  /* Dark text for contrast */
  padding: 4rem 2rem;
  text-align: center;
}

.contact h2 {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 2rem;
}

.contact form {
  max-width: 600px;
  margin: 0 auto;
  background-color: #ffffff;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.contact .form-group {
  margin-bottom: 1.5rem;
  text-align: left;
}

.contact label {
  font-size: 1rem;
  font-weight: 500;
  color: #2e2e2e;
  display: block;
  margin-bottom: 0.5rem;
}

.contact input,
.contact textarea {
  width: 100%;
  padding: 0.75rem;
  font-size: 1rem;
  color: #2e2e2e;
  background-color: #f9f9f9;
  border: 1px solid #ccc;
  border-radius: 4px;
  transition: all 0.3s ease-in-out;
}

.contact input:focus,
.contact textarea:focus {
  outline: none;
  border-color: #f5c51c;
  box-shadow: 0 0 5px rgba(245, 197, 28, 0.5);
}

.contact textarea {
  height: 150px;
  resize: vertical;
}

.contact .cta-button {
  background-color: #f5c51c;
  color: #ffffff;
  font-size: 1rem;
  font-weight: bold;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease-in-out;
}

.contact .cta-button:hover {
  background-color: #d4a017;
}

.conversation {
  background-color: #1f2937;
  padding: 4rem 2rem;
}

/* Container for the entire conversation */
.conversation-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 600px;
  margin: 0 auto;
  background-color: #1f2937;
  padding: 2rem;
  border-radius: 10px;
}

.chat-bubble {
  background-color: #1f2937;
  border-radius: 15px;
  padding: 1rem;
  position: relative;
  font-size: 1rem;
  color: #333;
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.5s ease, transform 0.5s ease;
}

.chat-bubble.alice {
  align-self: flex-start;
  background-color: #d1e7dd;
}

.chat-bubble.bob {
  align-self: flex-end;
  background-color: #f8d7da;
}

/* Image inside chat bubbles */
.chat-bubble img {
  max-width: 100%;
  border-radius: 10px;
  margin-top: 0.5rem;
}

/* When the chat bubble becomes visible */
.chat-bubble.visible {
  opacity: 1;
  transform: translateY(0);
}

h2 {
  font-size: 2rem;
  margin-bottom: 1.5rem;
  color: #ffd700;
  text-align: center;
  font-family: 'Roboto', sans-serif;
  font-weight: bold;
  letter-spacing: 2px;
  text-transform: uppercase;
  position: relative;
  opacity: 0;
  /* Initially hidden */
  animation: fadeInSlide 1s ease-out;
  animation-fill-mode: forwards;
}

h2::after {
  content: '';
  display: block;
  width: 50%;
  height: 4px;
  background: linear-gradient(90deg, #ffd700, #dfcfa6);
  margin: 0.5rem auto 0;
  border-radius: 2px;
  transform: scaleX(0);
  /* Initially hidden */
  transform-origin: center;
  animation: growUnderline 0.5s ease-out 0.8s forwards;
}

@keyframes fadeInSlide {
  0% {
    opacity: 0;
    transform: translateY(-20px);
  }

  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes growUnderline {
  0% {
    transform: scaleX(0);
  }

  100% {
    transform: scaleX(1);
  }
}
</style>