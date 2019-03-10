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
async function loader(jsonUpload, weightsUpload) {
	this.jsonUpload = jsonUpload;
	this.weightsUpload = weightsUpload;	

	const model = await tf.loadModel(tf.io.browserFiles([jsonUpload.files[0], weightsUpload.files[0]]))    

	return model;
};

class AdditionRNNDemo {
	constructor(jsonUpload,weightsUpload, param, model) {
		const ch = '0123456789+ ';
		this.cTable = new CharacterTable(ch);
		this.testData = this.cTable.encodeBatch(param, 5);
		this.jsonUpload = jsonUpload;
		this.weightsUpload = weightsUpload;
		this.param = param;
		this.model = model;	
	}
	
	async pOut(cTable, testData, model, param) {
		console.log(this.testData.toString());
 		const Out = this.model.predict(this.testData);
 		console.log(Out.toString());
		const scores = Out.slice([0, 0, 0], [1, Out.shape[1], Out.shape[2]]).as2D(Out.shape[1], Out.shape[2]);
		const examplesDiv = document.getElementById('testExamples');
		const num = this.param[0].split('+');
		const result = (num[0]^0) + (num[1]^0); 
		const decoded = this.cTable.decode(scores);
		let isCorrect = false;
		if ((result^0) === (decoded^0) ) { isCorrect = true};
		examplesDiv.className = isCorrect ? 'answer-correct' : 'answer-wrong';
		examplesDiv.textContent = this.param[0] + ' = ' + (decoded^0).toString();
	}
}

async function runAdditionRNNDemo() {
  document.getElementById('outParam').addEventListener('click', async () => {
    const jsonUpload = document.getElementById('jsonUpload');
    const weightsUpload = document.getElementById('weightsupload');
    const param = [(document.getElementById('param').value).toString(),'0'];
    const model = await loader( jsonUpload, weightsUpload );
    const demo = new AdditionRNNDemo(jsonUpload,weightsUpload, param, model);
    await	demo.pOut()
    
  });
}

runAdditionRNNDemo();
