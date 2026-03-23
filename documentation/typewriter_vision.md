Typewriter Vision! A particley p5.js framebuffer experiment that probably shouldn't actually be in p5.js, but it was fun to make anyway!

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*y6x4YOK00zYRz73mvd0j0w.gif)![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*dBOUXd4VZ0C36jHVkSSekg.gif)

How do I make crunchy bleeding text that looks printed or distressed?

![captionless image](https://miro.medium.com/v2/resize:fit:1028/format:webp/1*-EkhPTQFLYH4Av-sE6a16g.png)![Blurred text + perlin noise -> perlin noise on overlay](https://miro.medium.com/v2/resize:fit:920/format:webp/1*XvNLieq4vJ88mOztMU4eFg.png)

![Parametrizing THRESHOLD filter](https://miro.medium.com/v2/resize:fit:1164/format:webp/1*vjxf1svopah6HeUEZU44oA.gif)![captionless image](https://miro.medium.com/v2/resize:fit:528/format:webp/1*5o4Em2_00RM27nI1SbCj0w.png)

Any ASCII character from 33 to 126 is fair game to be printed in typical english text, so I turn all of these into symbols to use.

[Blend modes](https://p5js.org/reference/p5/blendMode/)

Default [filters](https://p5js.org/reference/p5/filter/) (filter the entire canvas)

Messing with perlin [noise](https://p5js.org/reference/p5/noise/) parameters: [noiseDetail](https://p5js.org/reference/p5/noiseDetail/) & noiseScale.

p5js [framebuffers](https://p5js.org/reference/p5/p5.Framebuffer/) are high performance drawing surfaces that allow you to draw to an offscreen image that acts like a canvas — you can use any of the p5js draw capabilities on this canvas. Then, you can take these framebuffers and very quickly scale and draw them as images on your main canvas. I created a framebuffer to act as a noise filter, then many framebuffers for 10 variations of each character (low to high threshold, giving me lightest to darkest for each).

Framebuffers require WEBGL mode, meaning I no longer have access to the overlay filter.

[Video capture](https://p5js.org/examples/imported-media-video-capture/) + [loadPixels](https://p5js.org/reference/p5.Image/loadPixels/) to analyze the r, g, and b values of each pixel every frame.

![Putting text on a grid — extracted from sample text](https://miro.medium.com/v2/resize:fit:1324/format:webp/1*XxZmfKhnF9Xg8TgPFXTnEg.gif)

Playing with scrambling the text with the cursor — keeping 100 scrambled states active at a time.

![Marching text (moving up one index every four frames)](https://miro.medium.com/v2/resize:fit:1296/format:webp/1*xMdD7Au4nzSfmcbuMKWDFA.gif)

Let’s try scrambling characters before scrambled ones in the row, then allowing them to randomly disappear with a 1/5 chance, rather than decay after a set count.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*Oylm5VFZe2KVZhJyyeTk3w.gif)

Since I’m using a grid array to track the scrambled characters, this is pretty easy.

Final step: get rid of that mouse! Record the previous frame’s average values in a 2d array. Now a letter in one square will scramble if the absolute difference that square’s average and the previous frame’s average is over a certain theshold. Keep the text scrambling across the page leftwards, but make decay a 1/3 chance instead of a 1/5 chance.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*eGFVEDCArB9HRx6RP4RDNw.gif)

All the while, keep adjusting grid ratios to make text look as natural as possible. My “pixel size” is 7, but my rows size twice as large as my column size. Also, the size of one of my character images is more than twice the size of the actual “pixel size” so that each character gets closer together. I draw every character on multiply blend mode so that the whites are fully transparent.

Here’s what some perfect grids look like.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*cvNi3WC1LF-Jv8iRunI5PQ.png)![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*-iSsb9gFX3iEIsd5HaG5Mw.png)

All of these ratios are parametrized, so many different looks are still possible.

Having a smaller pixel size allows the image itself to be more visible, but the text becomes less legible

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*bV-iAmBsKC2-Z2spPaKBIg.png)

And now, let’s try the filter on a video! With some edits for clarity of image over text, here it is on an animation my friend made.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*yE1ji5eMdxFZE5LlQMn-DQ.gif)![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*83ETVCd5nS4lSWaRHfJEtQ.gif)

Animal files are sourced from https://davidoreilly.itch.io/everything-library-animals