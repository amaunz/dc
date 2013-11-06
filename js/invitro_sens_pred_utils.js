var strSep = function() {
  return '__AND__'
}

var labeler = function(lab, sep) {
  if (sep==undefined) sep="\n"
  return(lab.split(strSep()).join(sep))
}

var getCancerTypeNumber = function (cancerType) {
  if (cancerType == 'MAXF') return 0 
  if (cancerType == 'CXF')  return 1
}

var getDimensions = function() {
  return {
    x: 'Invitro',
    y: 'Invivo',
  }
}

var getDimensionName = function(which) {
  return getDimensions()[which]
}

var getTumorModelAndCompoundSelector = function(d) {
  return d.tumorModel + strSep() + d.compound
}

var getTumorModelAndCompoundAndDimSelector = function(d) {
  return d.tumorModel + strSep() + d.compound + strSep() + d.dim
}

var getTumorModelAndCompoundExtentX = function(cancerData) {
  return d3.extent(cancerData, function(d){return d.tmcdCountX})
}

var getTumorModelAndCompoundExtentY = function(cancerData) {
  return d3.extent(cancerData, function(d){return d.tmcdCountY})
}

var getTumorModelAndCompoundDimExtent = function(cancerData) {
  return d3.extent(getTumorModelAndCompoundExtentX(cancerData)
           .concat(getTumorModelAndCompoundExtentY(cancerData)))
}

// add counts for specified cols
var addCountsForTumorModelAndCompound = function(data) {
  var facts = crossfilter(data)
  var tumorModelAndCompoundDimDim = facts.dimension(function(d) {return getTumorModelAndCompoundAndDimSelector(d)})
  var tumorModelAndCompoundDimHist = tumorModelAndCompoundDimDim.group().reduceCount()
  var counts = tumorModelAndCompoundDimHist.all()
  counts.forEach(function(count) {
    var modelCompoundDimAry = count.key.split(strSep())
    data.forEach(function(d,i){
      if (d.tumorModel == modelCompoundDimAry[0] && d.compound == modelCompoundDimAry[1] && d.dim == modelCompoundDimAry[2]) {
        if (d.dim == 'x')
          d.tmcdCountX = count.value
        if (d.dim == 'y')
          d.tmcdCountY = count.value
        if (d.tmcdCountX == undefined)
          d.tmcdCountX = 0
        if (d.tmcdCountY == undefined)
          d.tmcdCountY = 0
      }
    })
  })
  return data
}

