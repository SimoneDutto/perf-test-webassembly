mod utils;

use serde::{Deserialize, Serialize};
use std::cmp::Ordering;
use wasm_bindgen::prelude::*;

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct Sample {
    pub x: i32,
    pub y: i32,
}

#[wasm_bindgen]
pub fn add(a: i32, b: i32) -> i32 {
    return a + b;
}

#[wasm_bindgen]
pub fn sort(vec: Vec<i32>) -> Vec<i32> {
    vec.clone().sort();
    return vec;
}

#[wasm_bindgen]
pub fn sort_struct(val: &JsValue) {
    utils::set_panic_hook();
    // web_sys::console::log_1(val);
    let mut samples: Vec<Sample> = serde_wasm_bindgen::from_value(val.clone()).unwrap();
    samples.sort_by(|a, b| a.x.partial_cmp(&b.x).unwrap_or(Ordering::Equal));

    return;
}
