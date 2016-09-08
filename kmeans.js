var figue = function () {
	
	function euclidianDistance (vec1 , vec2) {
		var N = vec1.length ;
		var d = 0 ;
		for (var i = 0 ; i < N ; i++)
			d += Math.pow (vec1[i] - vec2[i], 2)
		d = Math.sqrt (d) ;
		return d ;
	}
	
	function addVectors (vec1 , vec2) {
		var N = vec1.length ;
		var vec = new Array(N) ;
		for (var i = 0 ; i < N ; i++)
			vec[i] = vec1[i] + vec2[i] ;
		return vec ;
	}	
	
	function multiplyVectorByValue (value , vec) {
		var N = vec.length ;
		var v = new Array(N) ;
		for (var i = 0 ; i < N ; i++)
			v[i] = value * vec[i] ;
		return v ;
	}	
	
	function getRandomVectors(k, vectors) {
		
		var n = vectors.length ;
		if ( k > n ) 
			return null ;
		
		var selected_vectors = new Array(k) ;
		var selected_indices = new Array(k) ;
		
		var tested_indices = new Object ;
		var tested = 0 ;
		var selected = 0 ;
		var i , vector, select ;
		while (selected < k) {
			if (tested == n)
				return null ;
			
			var random_index = Math.floor(Math.random()*(n)) ;
			if (random_index in tested_indices)
				continue ;
			
			tested_indices[random_index] = 1;
			tested++ ;
			vector = vectors[random_index] ;
			select = true ;
			for (i = 0 ; i < selected ; i++) {
				if ( vector.compare (selected_vectors[i]) ) {
					select = false ;
					break ;
				}
			}
			if (select) {
				selected_vectors[selected] = vector ;
				selected_indices[selected] = random_index ; 
				selected++ ;
			}
		}
		return {'vectors': selected_vectors, 'indices': selected_indices} ;
	}
	
	function kmeans (k, vectors) {
			var n = vectors.length ;
			var assignments = new Array(n) ;
			var clusterSizes = new Array(k) ;
			var repeat = true ;
			var nb_iters = 0 ;
			var centroids = null ;
			
			var t = getRandomVectors(k, vectors) ;
			if (t == null)
				return null ;
			else
				centroids = t.vectors ;
				
			while (repeat) {
				for (var j = 0 ; j < k ; j++)
					clusterSizes[j] = 0 ;
				
				for (var i = 0 ; i < n ; i++) {
					var vector = vectors[i] ;
					var mindist = Number.MAX_VALUE ;
					var best ;
					for (var j = 0 ; j < k ; j++) {
						dist = euclidianDistance (centroids[j], vector)
						if (dist < mindist) {
							mindist = dist ;
							best = j ;
						}
					}
					clusterSizes[best]++ ;
					assignments[i] = best ;
				}
			
				var newCentroids = new Array(k) ;
				for (var j = 0 ; j < k ; j++)
					newCentroids[j] = null ;

				for (var i = 0 ; i < n ; i++) {
					cluster = assignments[i] ;
					if (newCentroids[cluster] == null)
						newCentroids[cluster] = vectors[i] ;
					else
						newCentroids[cluster] = addVectors (newCentroids[cluster] , vectors[i]) ;	
				}

				for (var j = 0 ; j < k ; j++) {
					newCentroids[j] = multiplyVectorByValue (1/clusterSizes[j] , newCentroids[j]) ;
				}	
				

				repeat = false ;
				for (var j = 0 ; j < k ; j++) {
					if (! newCentroids[j].compare (centroids[j])) {
						repeat = true ; 
						break ; 
					}
				}
				centroids = newCentroids ;
				nb_iters++ ;
				

				if (nb_iters > figue.KMEANS_MAX_ITERATIONS)
					repeat = false ;
				
			}
			return { 'centroids': centroids , 'assignments': assignments
				
			} ;

		}
		return { 
		KMEANS_MAX_ITERATIONS: 25,
		kmeans: kmeans
		}
	
}() ;
Array.prototype.compare = function(testArr) {
    if (this.length != testArr.length) return false;
    for (var i = 0; i < testArr.length; i++) {
        if (this[i].compare) { 
            if (!this[i].compare(testArr[i])) return false;
        }
        if (this[i] !== testArr[i]) return false;
    }
    return true;
}
