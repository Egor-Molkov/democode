class CharacterTable {
  constructor(chars) {
    this.chars = chars;
    this.charIndices = {};
    this.indicesChar = {};
    this.size = this.chars.length;

    for (let i = 0; i < this.size; ++i) {
      const char = this.chars[i];
      if (this.charIndices[char] != null) {
        throw new Error(`Duplicate character '${char}'`);
      }
      this.charIndices[this.chars[i]] = i;
      this.indicesChar[i] = this.chars[i];
    }
  }

  encode(str, numRows) {

    const buf = tf.buffer([numRows, this.size]);
    for (let i = 0; i < str.length; ++i) {
      const char = str[i];
      if (this.charIndices[char] == null) {
        throw new Error(`Unknown character: '${char}'`);
      }
      buf.set(1, i, this.charIndices[char]);
    }
    
    return buf.toTensor().as2D(numRows, this.size);
  }

  encodeBatch(strings, numRows) {

    const numExamples = strings.length;
    const buf = tf.buffer([numExamples, numRows, this.size]);
    for (let n = 0; n < numExamples; ++n) {
      const str = strings[n];
      for (let i = 0; i < str.length; ++i) {
        const char = str[i];
        if (this.charIndices[char] == null) {
          throw new Error(`Unknown character: '${char}'`);
        }
        buf.set(1, n, i, this.charIndices[char]);
      }
    }

    return buf.toTensor().as3D(numExamples, numRows, this.size);
  }

  /**
   * Convert a 2D tensor into a string with the CharacterTable's vocabulary.
   *
   * @param x Input 2D tensor.
   * @param calcArgmax Whether to perform `argMax` operation on `x` before
   *   indexing into the `CharacterTable`'s vocabulary.
   * @returns The decoded string.
   */
  decode(x, calcArgmax = true) {
   return tf.tidy(() => {
      if (calcArgmax) {
        x = x.argMax(1);
      }
      const xData = x.dataSync();  // TODO(cais): Performance implication?
      let output = '';
      for (const index of Array.from(xData)) {
        output += this.indicesChar[index];
      }
      return output;
    }); 
 
   }
}

function generateData(digits, numExamples) {
  let output = [];
  while (output.length < numExamples) {
    let a = (Math.random() * 10**digits)^0;
    let b = (Math.random() * 10**digits)^0;
    let q = `${a}+${b}`;
    
    let ans = ((a+b)^0).toString();
    if ( ans.length == digits ) { ans='0'+ans; };
    if ( ans.length == ( digits - 1 ) ) { ans='00'+ans; };
    output.push([q, ans]);
  }
  return output;
}

function convertDataToTensors(data, charTable, digits) {
  const maxLen = digits + 1 + digits;
  const questions = data.map(datum => datum[0]);
  const answers = data.map(datum => datum[1]);
  return [charTable.encodeBatch(questions, maxLen), charTable.encodeBatch(answers, digits + 1)];
}

function createAndCompileModel(
    layers, hiddenSize, rnnType, digits, vocabularySize) {
  const maxLen = digits + 1 + digits;

  const model = tf.sequential();
  switch (rnnType) {
    case 'SimpleRNN':
      model.add(tf.layers.simpleRNN({
        units: hiddenSize,
        recurrentInitializer: 'glorotNormal',
        inputShape: [maxLen, vocabularySize]
      }));
      break;
    case 'GRU':
      model.add(tf.layers.gru({
        units: hiddenSize,
        recurrentInitializer: 'glorotNormal',
        inputShape: [maxLen, vocabularySize]
      }));
      break;
    case 'LSTM':
      model.add(tf.layers.lstm({
        units: hiddenSize,
        recurrentInitializer: 'glorotNormal',
        inputShape: [maxLen, vocabularySize]
      }));
      break;
    default:
      throw new Error(`Unsupported RNN type: '${rnnType}'`);
  }
  model.add(tf.layers.repeatVector({n: digits + 1}));
  switch (rnnType) {
    case 'SimpleRNN':
      model.add(tf.layers.simpleRNN({
        units: hiddenSize,
        recurrentInitializer: 'glorotNormal',
        returnSequences: true
      }));
      break;
    case 'GRU':
      model.add(tf.layers.gru({
        units: hiddenSize,
        recurrentInitializer: 'glorotNormal',
        returnSequences: true
      }));
      break;
    case 'LSTM':
      model.add(tf.layers.lstm({
        units: hiddenSize,
        recurrentInitializer: 'glorotNormal',
        returnSequences: true
      }));
      break;
    default:
      throw new Error(`Unsupported RNN type: '${rnnType}'`);
  }
  model.add(tf.layers.timeDistributed(
      {layer: tf.layers.dense({units: vocabularySize})}));
  model.add(tf.layers.activation({activation: 'softmax'}));
  model.compile({
    loss: 'categoricalCrossentropy',
    optimizer: 'adam',
    metrics: ['accuracy']
  });
 return model;
}

class AdditionRNNDemo {
  constructor(digits, trainingSize, rnnType, layers, hiddenSize, numTestExamples) {
    // Prepare training data.
    const chars = '0123456789+ ';
    this.charTable = new CharacterTable(chars);
    console.log('Generating training data');
    const data = generateData(digits, trainingSize);
    //console.log(data);      
    const split = trainingSize - numTestExamples;
    this.trainData = data.slice(0, split);
    this.testData = data.slice(split);
    //console.log(this.trainData+'/'+this.testData); 
    [this.trainXs, this.trainYs] = convertDataToTensors(this.trainData, this.charTable, digits);
    [this.testXs, this.testYs] = convertDataToTensors(this.testData, this.charTable, digits);
    this.model = createAndCompileModel(layers, hiddenSize, rnnType, digits, chars.length);
  }
  async train(iterations, batchSize, numTestExamples) {
    const lossValues = [];
    const accuracyValues = [];
    const examplesPerSecValues = [];
    for (let i = 0; i < iterations; ++i) {
      const beginMs = performance.now();
      const history = await this.model.fit(this.trainXs, this.trainYs, {
        epochs: 1,
        batchSize,
        validationData: [this.testXs, this.testYs],
        yieldEvery: 'epoch'
      });
      const elapsedMs = performance.now() - beginMs;
      const examplesPerSec = this.testXs.shape[0] / (elapsedMs / 1000);
      const trainLoss = history.history['loss'][0];
      const trainAccuracy = history.history['acc'][0];
      const valLoss = history.history['val_loss'][0];
      const valAccuracy = history.history['val_acc'][0];
      document.getElementById('trainStatus').textContent = `Iteration ${i+1}: train loss = ${trainLoss.toFixed(6)}; ` + `train accuracy = ${trainAccuracy.toFixed(6)}; ` + `validation loss = ${valLoss.toFixed(6)}; ` + `validation accuracy = ${valAccuracy.toFixed(6)} ` + `(${examplesPerSec.toFixed(1)} examples/s)`;

      lossValues.push({ 'epoch': i, 'loss': trainLoss, 'set': 'train' });
      lossValues.push({ 'epoch': i, 'loss': valLoss, 'set': 'validation' });


      if (this.testXsForDisplay == null || this.testXsForDisplay.shape[0] !== numTestExamples) {
        if (this.textXsForDisplay) {
          this.textXsForDisplay.dispose();
        }
        this.testXsForDisplay = this.testXs.slice([0, 0, 0], [numTestExamples, this.testXs.shape[1], this.testXs.shape[2]]);
	
      }

      const examples = [];
      const isCorrect = [];
      tf.tidy(() => {
        const predictOut = this.model.predict(this.testXsForDisplay);
        for (let k = 0; k < numTestExamples; ++k) {
         const scores = predictOut.slice([k, 0, 0], [1, predictOut.shape[1], predictOut.shape[2]]).as2D(predictOut.shape[1], predictOut.shape[2]);
         let decoded = this.charTable.decode(scores);decoded = decoded^0;
         let td = this.testData[k][1]^0;
          examples.push(this.testData[k][0] + ' = ' + decoded.toString());
          isCorrect.push(td === decoded);
        }
      });

      const examplesDiv = document.getElementById('testExamples');
      while (examplesDiv.firstChild) {
        examplesDiv.removeChild(examplesDiv.firstChild);
      }
      for (let i = 0; i < examples.length; ++i) {
        const exampleDiv = document.createElement('div');
        exampleDiv.textContent = examples[i];
        exampleDiv.className = isCorrect[i] ? 'answer-correct' : 'answer-wrong';
        examplesDiv.appendChild(exampleDiv);
      }
    }
   this.model.save('downloads://my-model-1');
  }
}

async function runAdditionRNNDemo() {
  document.getElementById('trainModel').addEventListener('click', async () => {
  
    const digits = +(document.getElementById('digits')).value;
    const trainingSize = +(document.getElementById('trainingSize')).value;
    const rnnTypeSelect = document.getElementById('rnnType');
    const rnnType = rnnTypeSelect.options[rnnTypeSelect.selectedIndex].getAttribute('value');
    const layers = +(document.getElementById('rnnLayers')).value;
    const hiddenSize = +(document.getElementById('rnnLayerSize')).value;
    const batchSize = +(document.getElementById('batchSize')).value;
    const trainIterations = +(document.getElementById('trainIterations')).value;
    const numTestExamples = +(document.getElementById('numTestExamples')).value;

    // Do some checks on the user-specified parameters.
    const status = document.getElementById('trainStatus');
    if (digits < 1 || digits > 5) {
      status.textContent = 'digits must be >= 1 and <= 5';
      return;
    }
    const trainingSizeLimit = Math.pow(Math.pow(10, digits), 2);
    if (trainingSize > trainingSizeLimit) {
      status.textContent =
          `With digits = ${digits}, you cannot have more than ` +
          `${trainingSizeLimit} examples`;
      return;
    }

    const demo = new AdditionRNNDemo(digits, trainingSize, rnnType, layers, hiddenSize, numTestExamples);
    await demo.train(trainIterations, batchSize, numTestExamples);
    
  });
}

runAdditionRNNDemo();


















