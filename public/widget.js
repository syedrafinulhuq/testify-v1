// Testify Widget Script
(function () {
  // Find the script tag itself to get the user ID
  const scriptTag = document.currentScript;
  const userId = scriptTag?.getAttribute('data-user-id');

  if (!userId) {
    console.error('Testify Widget: User ID not found in script tag.');
    return;
  }

  // Create a container div for the testimonials
  const widgetContainerId = `testify-widget-${userId}`;
  let container = document.getElementById(widgetContainerId);

  // Ensure container exists, place it after the script tag if not found
   if (!container) {
    container = document.createElement('div');
    container.id = widgetContainerId;
    scriptTag.parentNode.insertBefore(container, scriptTag.nextSibling);
   }


  // --- Basic Styling (Can be customized) ---
  container.style.fontFamily = 'Arial, sans-serif';
  container.style.border = '1px solid #eee';
  container.style.borderRadius = '8px';
  container.style.padding = '20px';
  container.style.maxWidth = '600px'; // Adjust as needed
  container.style.margin = '20px auto'; // Center the widget
  container.style.backgroundColor = '#ffffff';
  container.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
  container.style.overflow = 'hidden'; // Ensure content stays within bounds

  // --- Fetch Testimonials (Replace with actual API endpoint) ---
  // This is a MOCK fetch. You'll need a real API endpoint that returns
  // testimonials for the given userId (likely fetched from Firestore).
  // Example API URL: `https://your-api.com/testimonials?userId=${userId}`

  const mockApiUrl = `https://jsonplaceholder.typicode.com/comments?postId=1&_limit=3`; // MOCK API URL - REPLACE!

   // Display loading state
   container.innerHTML = '<p style="text-align: center; color: #aaa;">Loading testimonials...</p>';

  fetch(mockApiUrl) // REPLACE with your actual API endpoint call
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(testimonials => {
        container.innerHTML = ''; // Clear loading state

        if (!testimonials || testimonials.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: #aaa;">No testimonials yet.</p>';
            return;
        }

        // Add a title (optional)
        const titleElement = document.createElement('h3');
        titleElement.textContent = 'What Our Customers Say';
        titleElement.style.textAlign = 'center';
        titleElement.style.marginBottom = '20px';
        titleElement.style.color = '#333';
        container.appendChild(titleElement);


        // --- Render Testimonials ---
        testimonials.forEach(testimonial => {
            // MOCK Data Mapping - Adjust based on your actual data structure
            const name = testimonial.name || 'Anonymous';
            const text = testimonial.body || 'No content'; // Using 'body' from mock API
            const company = testimonial.email ? testimonial.email.split('@')[1] : ''; // Mock company from email domain

            const testimonialElement = document.createElement('div');
            testimonialElement.style.borderBottom = '1px solid #eee';
            testimonialElement.style.padding = '15px 0';
            testimonialElement.style.marginBottom = '15px';

             // Remove border from the last item
             if (testimonials.indexOf(testimonial) === testimonials.length - 1) {
                testimonialElement.style.borderBottom = 'none';
                testimonialElement.style.marginBottom = '0';
                testimonialElement.style.paddingBottom = '0';
             }


            const quoteElement = document.createElement('p');
            quoteElement.textContent = `"${text}"`;
            quoteElement.style.fontStyle = 'italic';
            quoteElement.style.marginBottom = '10px';
            quoteElement.style.color = '#555';

            const authorElement = document.createElement('p');
            authorElement.style.fontWeight = 'bold';
            authorElement.style.textAlign = 'right';
             authorElement.style.color = '#333';
            authorElement.textContent = `- ${name}${company ? `, ${company}` : ''}`;

            testimonialElement.appendChild(quoteElement);
            testimonialElement.appendChild(authorElement);
            container.appendChild(testimonialElement);
        });
    })
    .catch(error => {
        console.error('Testify Widget Error:', error);
        container.innerHTML = '<p style="text-align: center; color: red;">Could not load testimonials.</p>';
    });

})();
