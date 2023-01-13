<?php

use NlpTools\Tokenizers\WhitespaceAndPunctuationTokenizer;

function stripPunctuation($string): string
{
    $string = strtolower($string);
    $string = preg_replace(   '/[[:punct:]]/'   ," ", $string);
    return trim($string);
}

function convertToSeparatedTokens($string): string
{
    $string = stripPunctuation($string);
    $tokenizer = new WhitespaceAndPunctuationTokenizer();
    $tokens = $tokenizer->tokenize($string);
    array_walk($tokens, function(&$value) {
        if($value) {
            $value = $value . '*';
        }
    });
    return implode(' ', $tokens);
}

function convertToSeparatedTokensForLike($string): string
{
    $tokens = explode(' ', $string);
    $tokens = array_diff($tokens, array(''));

    array_walk($tokens, function(&$value) {
        if($value) {
            $value = $value . '%';
        }
    });
    return implode(' ', $tokens);
}
