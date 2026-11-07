During training, a language model repeatedly predicts the next token. Later, we ask it to summarize, classify sentiment and answer questions. Why should practice on one task help with another?

This is the question that drew me to Ilya Sutskever's **An Observation on Generalization**. One useful interpretation is that prediction exploits regularities, and regularities that can be reused across materials may also help with new tasks. Compression gives us a way to ask how much information those regularities save.

This article reorganizes my Notion study notes. The talk is available through the [Simons Institute](https://simons.berkeley.edu/talks/ilya-sutskever-openai-2023-08-14). Those notes also drew on Hao Bai's illustrated account. This is an accessible interpretation, not a transcript. Numerical and everyday examples below are explanatory inventions, not experimental measurements.

## 1. Why should success on practice problems carry over?

Think of a model as a student working through a workbook. Training error measures mistakes on the examples used for learning. Test error measures performance on new examples. Generalization asks whether what was learned carries over.

Memorizing answers can produce a perfect workbook score. Low training error alone therefore does not establish useful learning. Under appropriate assumptions, supervised-learning theory can bound the gap between training performance and performance on new data. Intuitively, a larger collection of candidate rules offers more opportunities to find one that fits by chance; more independent examples from the target distribution can help expose that coincidence.

The assumptions matter. Training and future examples need an appropriate distributional relationship, and the complexity of the candidate rules must be controlled. This is not the claim that having more examples than parameters guarantees generalization. Nor does a same-distribution result automatically apply to arbitrary unfamiliar environments.

Language models add another question: even if next-token prediction generalizes, why should it help sentiment classification? **Generalization within a task and transfer between tasks need separate explanations.**

## 2. Learning signals without human labels

Imagine a model reading reviews such as “The acting is excellent; this film is worth watching” and “The plot drags; I left disappointed.” Rather than labeling each review positive or negative, we can hide its continuation and ask the model to predict it. The text itself supplies the answer. This is self-supervised learning, often discussed within the broader category of unsupervised learning.

Predicting these continuations may require learning evaluative language, tone and contextual relationships. Those regularities may then help classify new reviews. Instructions, examples or further training may still be needed.

Reading more does not guarantee competence at every task. Transfer requires useful shared structure between earlier data and the later task, plus a learning method capable of exploiting it.

The notes also discuss distribution matching. In a substitution cipher, letter frequencies and recurring combinations provide clues even without paired plaintext and ciphertext. But a decoded string that resembles English is not necessarily the correct message. Matching aggregate patterns can narrow the possibilities without identifying a unique answer.

## 3. Where prediction meets compression

![Patterns from many materials become reusable structure](/img_Blog/generalization-compression.png)

*Figure 1. Extracting reusable structure. This conceptual image does not imply that model parameters alone can reconstruct all training data.*

To store `ABABABAB`, we could record every character or describe it as “repeat AB four times.” A regularity makes the description shorter.

Probability prediction connects to compression more precisely. A decodable coding scheme can assign shorter codes to common outcomes and longer codes to rare ones. Given a probability model, the ideal coding cost of an actual outcome is approximately:

$$\ell=-\log_2 p.$$

| Probability assigned to the actual outcome | Ideal cost |
| --- | --- |
| 1/2 | 1 bit |
| 1/4 | 2 bits |
| 1/8 | 3 bits |

A less probable outcome is more surprising and costs more to encode. Summing these costs across a sequence gives an ideal total length under the model. Real coders have overhead; the entries above are not necessarily the literal lengths of standalone codewords. [Language Modeling Is Compression](https://arxiv.org/abs/2309.10668) discusses the relationship between predictive models and lossless compressors.

A wrong prediction does not prevent lossless recovery. The encoder records what actually happened, possibly at greater cost. Lossless coding requires reconstruction, not a correct top prediction at every step.

For the same reason, GPT's parameters are not simply a ZIP archive of its training corpus. They supply predictive regularities; reconstructing a specific text generally also requires encoded data and a decoding procedure.

## 4. Likelihood: the answer is known; which model supports it?

Suppose the observed sentence ends with “take an umbrella.” After “take an,” model A assigns “umbrella” probability 80%, while model B assigns 10%.

Prediction asks what might happen next. Likelihood fixes the observed outcome and compares the probability different parameter settings assign to it. A has higher likelihood for this observation. **Likelihood is not the probability that a parameter setting is correct.**

Training considers a whole dataset. A common language-model objective is negative log-likelihood:

$$L(\theta)=-\sum_t\log_2 p_\theta(x_t\mid x_{<t}).$$

Read from the inside out: θ denotes model parameters, the context is everything before position t, and the token that actually occurs is the answer being scored. Add the cost at every position. A token is the model's text unit, not necessarily a word or character.

For a toy sequence of three tokens, suppose the probabilities assigned to the actual tokens are 1/2, 1/4 and 1/2. The total is 1 + 2 + 1 = 4 bits. Raising the middle probability to 1/2, with everything else unchanged, reduces it to 3 bits.

Increasing the likelihood of observed data thus connects to reducing its coding length under the model. That accounting does not yet include the model's own storage cost. See the [CMU lecture Distributions as Models](https://www.stat.cmu.edu/~cshalizi/statcomp/14/lectures/11/lecture-11.pdf) for the statistical definition of likelihood.

## 5. The shortest instruction manual

What is the shortest program that generates “AB repeated ten thousand times”? Printing every character is one option; using a loop is another. Kolmogorov complexity measures the length of the shortest program that generates specified data exactly on a chosen universal computer.

The complete instructions count. Hiding a book inside a decompression program and leaving a tiny “run” command does not compress the book to that command's length. Both the program and necessary data matter.

There is also a fundamental limit: no general algorithm computes this exact shortest length for every input. It is a theoretical reference, not a loss we can simply evaluate during training. [Alexander Shen's survey](https://arxiv.org/abs/1504.04955) introduces the underlying concepts.

### If you already have the old draft, what remains to send?

![Two documents share a turquoise structure, with a small amber difference](/img_Blog/generalization-shared-structure.png)

*Figure 2. Shared regularities can be reused; changes require additional description. A visual analogy for conditional compression.*

You and a friend already have draft X. To send a new version Y with a changed ending, you could resend everything or send just the edits.

Conditional complexity K(Y | X) asks how short a program can generate Y when it can read the existing X. Joint complexity instead starts from scratch and describes both. Up to a logarithmic correction, the relationship is:

$$K(X,Y)=K(X)+K(Y\mid X)+O(\log n).$$

Describe the old draft, then describe how to use it to obtain the new one. Here n is an appropriate data-length scale. The correction bounds the difference at logarithmic order; it is not a fixed number we can casually erase. This relates ideal shortest descriptions, not the guaranteed performance of a practical compressor.

If earlier material shares useful structure with a new task, it may reduce the information needed to describe what comes next. “Previous learning helps” becomes “existing information shortens the additional description.”

## 6. Regret: useful data and effective use are different

A hypothetical bill illustrates regret. Assume consistent coding conventions and include the necessary cost of describing the method.

| Situation | Information needed for the new draft |
| --- | --- |
| Best method without the old draft | 1,000 bits |
| Best method with the old draft | 100 bits |
| Current method with the old draft | 120 bits |

The old draft saves 1,000 − 100 = 900 bits in the ideal comparison. The current method pays 120 − 100 = 20 bits more than the chosen benchmark. That second difference is the regret in this example.

This explains a concept rather than reproducing a theorem from the talk. We must specify the benchmark and information available to each method. A benchmark based on an ideal shortest description generally cannot be calculated exactly.

Replace the old draft with an unrelated shopping list. If it provides no help, both the best and current methods might require 1,000 bits. Regret can be zero even though the supplied information is useless. Being close to a benchmark does not establish that prior data helped.

## 7. Did the model learn knowledge that is easy to use?

![Two groups of representation points separated by a straight line](/img_Blog/generalization-linear-probe.png)

*Figure 3. An easy-to-read representation may allow a simple linear decision boundary. This is a two-dimensional illustration, not an experimental result.*

Experiments add another perspective. iGPT treats images as pixel sequences, predicts later pixels without category labels, and then tests whether internal features support classification. [Chen and colleagues](https://proceedings.mlr.press/v119/chen20s.html) evaluate these representations using linear probes, fine-tuning and low-data classification.

A representation is a set of numerical coordinates the model produces for an input. A linear probe attaches a simple classifier to those coordinates: freeze the original model, train only the classifier, and evaluate on held-out data. This checks whether category information is easily accessible. [Alain and Bengio](https://arxiv.org/abs/1610.01644) describe independently trained probes for examining intermediate features.

As a two-dimensional example, place a cat image at (3, 1) and a dog image at (1, 3). Subtracting the second coordinate from the first gives positive and negative scores. A straight line separates these two points.

Real representations typically have many dimensions. The classifier takes a weighted sum plus a bias. “Linear” describes the readout, not the entire neural network.

Pretraining used no category labels; training the classifier still uses them. A strong probe supports the claim that the representation contains easily accessible classification information. It does not establish that the model understands everything.

## 8. What does the compression perspective leave open?

Compression connects several questions: regularities can improve prediction, probability predictions translate into coding costs, and shared structure may reduce the additional information needed for later tasks. But three gaps remain.

<div id="question-finite-compute-en" class="question-anchor"></div>

First, ideal shortest programs and practical neural networks differ. Capacity, data, compute and optimization all limit results. Stochastic gradient descent does not guarantee a shortest description.

<div id="question-linear-readout-en" class="question-anchor"></div>

Second, possessing information and making it accessible differ. Compression alone does not automatically explain why semantic information can be read out by a simple linear classifier.

<div id="question-prediction-objectives-en" class="question-anchor"></div>

Third, prediction objectives and practical needs differ. Lower average prediction loss does not guarantee improvement on every reasoning task or distribution shift. Predicting from preceding context and filling a gap using both sides impose different constraints; neither can be declared universally superior without specifying the task.

For me, the useful shift is to replace the broad question “Does it understand?” with more concrete ones. Which regularities does it exploit? Do they help describe new data? Is task-relevant information easy to extract? Which experiments actually test those claims?

These are more productive research questions than simply declaring that prediction is intelligence.

[Follow these questions in the Ilya open-question notebook](/ilya/questions/).

The three conceptual illustrations were AI-generated to support explanation. They are not figures from the original talk or papers.

## References and reading path

The original talk, technical sources and secondary account are distinguished below. The draft-editing, review and coordinate examples are teaching illustrations, not reported experiments.

1. **Ilya Sutskever. An Observation on Generalization.** Simons Institute, August 14, 2023. [Official page](https://simons.berkeley.edu/talks/ilya-sutskever-openai-2023-08-14) · [Video](https://www.youtube.com/watch?v=AKMuA_TVz3A). The motivating talk; no unverified verbatim quotations or slide numbers are supplied here.
2. **Alexander Shen. Around Kolmogorov complexity: basic notions and results.** 2015, arXiv:1504.04955. [Paper](https://arxiv.org/abs/1504.04955). Background on shortest programs, conditional and joint complexity.
3. **Grégoire Delétang et al. Language Modeling Is Compression.** 2023; revised 2024, arXiv:2309.10668. [Paper](https://arxiv.org/abs/2309.10668). Additional reading on prediction and compression, not asserted to be a citation made in the talk.
4. **Mark Chen, Alec Radford, Rewon Child, Jeffrey Wu, Heewoo Jun, David Luan, Ilya Sutskever. Generative Pretraining From Pixels.** ICML 2020, PMLR 119:1691–1703. [Paper](https://proceedings.mlr.press/v119/chen20s.html). iGPT training and representation evaluation.
5. **Guillaume Alain, Yoshua Bengio. Understanding intermediate layers using linear classifier probes.** 2016, arXiv:1610.01644. [Paper](https://arxiv.org/abs/1610.01644). The probe methodology.
6. **Cosma Shalizi. Distributions as Models.** CMU Statistical Computing lecture, 2014. [PDF](https://www.stat.cmu.edu/~cshalizi/statcomp/14/lectures/11/lecture-11.pdf). Statistical background on likelihood and maximum likelihood.
7. **Hao Bai's illustrated account of the talk.** [Article](https://biechi.github.io/blog/i1s2g3/). A secondary source used in the original notes, not a verified complete transcript or a substitute for the original recording.

For more intuition about probability and coding, see the earlier Chinese-language article [Revisiting Entropy: Compression, Prediction and Intelligence]({% post_url 2026-06-22-Entropy-Compression-Intelligence %}).
