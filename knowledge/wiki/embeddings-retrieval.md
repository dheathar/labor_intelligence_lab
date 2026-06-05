# Embeddings & Retrieval
*Turning text into searchable vectors — the backbone of OJA intelligence*

---

## What an embedding is

An embedding is a dense vector (e.g. 768 or 1024 numbers) that represents the *meaning* of a text. Similar texts map to nearby vectors. The key property:

```
embed("software engineer") ≈ embed("software developer")  (cosine similarity ≈ 0.92)
embed("software engineer") ≈ embed("plumber")             (cosine similarity ≈ 0.21)
```

For LIVLAB: we use embeddings to match free-text job titles to ESCO occupations, and to retrieve relevant knowledge base entries for rat context.

---

## Sentence embeddings vs token embeddings

**Token embeddings** (BERT [CLS], mean pooling): pool across all token representations to get one vector per sentence/document.

**Sentence transformers** (SBERT, multilingual-e5): trained specifically to produce good *sentence-level* representations via contrastive or triplet loss. Dramatically better than raw BERT for retrieval and similarity tasks.

For production use: always use a dedicated sentence transformer, not raw BERT mean pooling.

---

## Key models for multilingual labor market text

### multilingual-e5-large (Wang et al. 2022)
- 560M parameters, 1024-dim embeddings
- Trained on ~1B multilingual pairs (mC4 + translated MS-MARCO)
- Instruction-tuned variant: prepend "query: " or "passage: " to text
- Best open multilingual embedder as of 2025 across most benchmarks
- **LIVLAB use**: cross-lingual ESCO matching for WB6 job postings

### ESCOXLM-R (Beauchemin et al. 2023, arXiv:2305.12092)
- XLM-R large fine-tuned on ESCO occupation descriptions (44 languages)
- Specialized for occupational semantics — knows that "μηχανικός λογισμικού" ≅ "software engineer" ≅ "softver inženjeri"
- ISCO-2 accuracy: 0.81 on multilingual held-out set
- **LIVLAB use**: primary model for ESCO occupation classification

### LaBSE (Feng et al. 2020)
- 470M parameters, 768-dim
- Trained with translation ranking loss — very strong cross-lingual alignment
- Good for: does "Αναλυτής δεδομένων" (Greek) match "data analyst" (English)?
- Available: `sentence-transformers/LaBSE` on HuggingFace

---

## Vector similarity measures

**Cosine similarity**: angle between vectors. Range [-1, 1]. Standard for text retrieval.
```
cos(a, b) = (a · b) / (|a| × |b|)
```

**Dot product**: cosine × magnitudes. Used when you want to weight by vector magnitude (e.g. for long documents that should score higher).

**Euclidean distance**: for truly normalized vectors, equivalent to cosine. Less stable otherwise.

For retrieval: normalize all embeddings to unit length and use dot product (fastest, equivalent to cosine after normalization).

---

## Vector databases for LIVLAB

For 65 knowledge base entries: you don't need a vector database. A numpy array + cosine similarity search is fine. For 100k+ OJA embeddings:

| Option | Scale | Notes |
|--------|-------|-------|
| **numpy** | < 100k | Zero dependencies, ~50ms for 100k cosine search |
| **FAISS** (Facebook) | 1M+ | Sub-millisecond; approximate nearest neighbor (ANN) |
| **ChromaDB** | 100k–10M | Easy Python API, metadata filtering |
| **Qdrant** | 10M+ | Rust, production-grade, Docker-deployable |

For LIVLAB Phase 1: ChromaDB with `knowledge/` entries embedded at startup.

---

## RAG: Retrieval-Augmented Generation

The pattern that makes LLM agents grounded:

```
1. User query → embed with same model as documents
2. Vector similarity search → top-k relevant documents
3. Inject retrieved docs into LLM context window
4. LLM generates answer grounded in retrieved content
```

For LIVLAB rat_researcher, the retrieval step means: before writing a new knowledge entry, search the existing KB for related papers/methods to avoid duplicates and add proper cross-references.

**Chunking strategy for OJAs**: job postings are naturally short (300–500 tokens). Embed the full posting as one chunk. For longer documents (OECD reports, WEF Future of Jobs): chunk at paragraph boundaries, 300 tokens max, 50-token overlap.

---

## Hybrid search: dense + sparse

Dense (embedding) search is excellent at semantic similarity but misses exact keyword matches. Sparse (BM25) search nails exact terms but misses paraphrases. Hybrid:

```
score = α × dense_score + (1-α) × sparse_score
```

α ≈ 0.5–0.7 typically outperforms either alone. For LIVLAB OJA intelligence, hybrid search matters when users search for specific skill names ("PyTorch", "ESCO 2.19.1.2") that must match exactly.

---

## Embedding a LIVLAB knowledge base entry

When indexing a paper entry, embed:
- Title + abstract (for concept-level retrieval)
- Key findings (for specific fact retrieval)
- Topics/tags (for categorical filtering)

Concatenate fields with a separator: `"Title: {title}\nAbstract: {abstract}\nFindings: {findings}"`. This gives the embedder context about the structure.

---

## Re-ranking

After ANN retrieval returns top-50 candidates, a cross-encoder re-ranks them. A cross-encoder attends to both query and document jointly (full attention, not embedding cosine). Much more accurate than bi-encoder similarity, but too slow for first-stage retrieval.

For LIVLAB: useful for occupation classification — use ESCOXLM-R for top-50 candidate retrieval, then a cross-encoder to pick the best match.

---

## References
- Reimers & Gurevych (2019). SBERT. arXiv:1908.10084
- Wang et al. (2022). E5. arXiv:2212.03533
- Beauchemin et al. (2023). ESCOXLM-R. arXiv:2305.12092
- Feng et al. (2020). LaBSE. arXiv:2007.01852
- Lewis et al. (2020). RAG. arXiv:2005.11401
- Johnson et al. (2019). FAISS. arXiv:1702.08734
