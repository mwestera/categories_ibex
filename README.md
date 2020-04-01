## Ibex experiment for human judgments of category relatedness

Ibex code used for collecting human judgments of category relatedness, for a paper to be submitted (joint work with Abhijeet Gupta, Gemma Boleda and Sebastian Padó).

=================

User documentation at https://github.com/addrummond/ibex/blob/master/docs/manual.md

The following are some notes intended for developers.


1. Generating PDF documentation.
------------------------------------------------------------------------

Pandoc (http://pandoc.org) and LaTeX are required to generate PDF documentation.

Execute the following commands to generate a LaTeX version of the docs and then
compile it to a PDF:

    cd docs
    make manual.pdf


2. Packaging a release.
------------------------------------------------------------------------

You need to:

    * Run server.py with the --genhtml option to generate
      'experiment.html' and 'overview.html' in www/. For example, if
      you are in www/:

          python server.py --genhtml ./

    * Execute the following command from the root dir of the repo:

          sh mkdist.sh 0.3-beta-1234
