---
layout: post
title: "Rijndael Block Cypher"
category: QA
slug: rijndael-block-cypher
gpgkey: "EBE8 BD81 6838 1BAF"
---

## Table of Contents
- [Introduction](#introduction)
- [Basic Characteristics](#basic-characteristics)
- [Encryption and Decryption Algorithms](#encryption-and-decryption-algorithms)
- [Conclusion](#conclusion)

# Introduction

Rijndael or Advanced Encryption Standard (AES) algorithm is the new standard of symmetric block cyphers selected by the National Institute of Standards and Technology (NIST) to replace the old Data Encryption Standard (DES).

Rijndael has its origins in Square, another algorithm designed by the pair; the Belgian cryptologists, Joan Daemen and Vincent Rijmen. I think that is enough for an introduction.

# Basic Characteristics

Rijndael is a block cypher using 128, 192 and 256-bit input/output blocks and keys. Rijndael is also an iterated block cipher, meaning that it encrypts and decrypts a block of data by the iteration or round of a specific transformation.

If you do have any curiosity, Google is just a few letters away.

# Encryption and Decryption Algorithms

<figure><amp-img alt="Encryption and Decryption Algorithms" src="/img/rijndael-structure-encryption-decryption.webp" width="640" height="337" layout="responsive"
></amp-img><figcaption>Fig. 1: (a) Encryption Algorithm (b) Decryption Algorithm</figcaption></figure>

Encryption and decryption algorithms for 128-bit input/output blocks and user keys are depicted in (a) and (b) respectively. Both encryption and decryption algorithms use the different ordering of basic operations. The decryption operation implements the inverse version of the encryption operation. As a consequence of this fact, resource sharing between both logic is very limited.

# Conclusion

I tried to make this as simple as possible, but things are getting complicated. I should stop writing for today.
