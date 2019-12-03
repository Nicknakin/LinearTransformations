class Matrix{
    constructor(vals, dims){
        if(dims.reduce((acc, val) => acc*val, 1) == vals.length){
            this.vals = vals;
            this.dims = dims;
            this.shaped = shapeArray(dims, vals);
        }
    }

    det(){
        if(!this.dims.reduce((acc, val) => [val, acc[0] == val && acc[1]], [this.dims[0], true])[1]){
            return NaN;
        }
        return determinant(this.shaped);
    }

    dot(mat2){
        if(this.dims[1] == mat2.dims[0]){
            let newDims = [this.dims[0], mat2.dims[1]];
            let args = [this.shaped, rotateArray(mat2.shaped)];
            let arr = [];
            for(let i = 0; i < newDims[1]; i++){
                for(let k = 0; k < newDims[0]; k++){
                    arr.push(dotProduct(args[1][k], args[0][i]));
                }
            }
            return new Matrix(arr, newDims);
        }
        return null;
    }
}

function randomMatrix(dims){
    return new Matrix(new Array(dims.reduce((acc, val) => acc*val, 1)).fill().map(() => Math.random()*2-1), dims);
}

function determinant(m){
    if(m.length == 1) {
        return m[0][0];
    } else if(m) {
        let accumulator = 0;
        for(let i = 0; i < m.length; i++){
            accumulator -= ((i%2)*2-1)*m[0][i]*determinant(m.filter((a, iter) => iter != 0).map(row => row.filter((val, iter) => iter != i)))
        }
        return accumulator;
    }
        return null;    
}

function rotateArray(array){
    let arr = new Array(array[0].length).fill().map(() => []);
    for(let i = 0; i < array.length; i++){
        for(let k = 0; k < array[i].length; k++){
            arr[k].push(array[i][k]);
        }
    }
    return arr;
}