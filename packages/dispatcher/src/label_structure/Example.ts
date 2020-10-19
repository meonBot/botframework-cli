/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {Label} from "./Label";

export class Example {
    public static newIntentExample(
        text: string,
        labels: string[],
        spanOffset: number = 0,
        spanLength: number = 0): Example {
        return new Example(text, labels.map((x: string) => Label.newIntentLabel(x, spanOffset, spanLength)));
    }

    public text: string;

    public labels: Label[];

    constructor(text: string, labels: Label[]) {
        this.text = text;
        this.labels = labels;
    }

    public toObject(): {
        "text": string;
        "labels": Array<{
            "name": string;
            "labeltype": number;
            "span": {
                "offset": number;
                "length": number; }; }>; } {
        return {
          text: this.text,
          labels: this.labels.map((x: Label) => x.toObject()),
        };
    }
}