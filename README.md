# Make your own charting library with D3

D3 gives you the flexibility needed for making creative visualizations, but
this flexibility leaves the door open for spaghetti code. To prevent this you
need to prepare your data and pass it into a visualization that has been
wrapped up for reuse.

We'll show how to wrap the visualization up in a jQuery plugin and general
approaches and techniques for data preparation. The example will be based on
code in production for over 6 months at Yieldbot and all questions on how the
code works are encouraged. It will be html and css based so no svg knowledge
is required. I'll also discuss potential future directions and the code will
be available to all before and after the talk in the following repo so you
can put what you learn to work with your own data.

https://github.com/solenoid/d3-plugin-talk

# Getting Started

- `git clone git@github.com:solenoid/d3-plugin-talk.git`

- Run a HTTP server: You can for example use the SimpleHTTPServer module of python and run `python -m SimpleHTTPServer` on the command line.

- Finally, open http://0.0.0.0:8000/
