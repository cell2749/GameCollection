

var mountNode=document.getElementById("main");

var Table = React.createClass({
	
	getInitialState: function() {
	    return {
	     	collection: [],
	     	view: 0,
	     	sort: [(-1),(-1)]
	    };
	},
	ListView: function(event){
		this.setState({view:0})
	},
	DetailView: function(event){
		this.setState({view:1})

	},
	EditView: function(event){
		this.setState({view:2})
	},
	DisplayDetails: function(event){
		
		for(i=0;i<this.state.collection.length;i++){
			document.getElementById(this.state.collection[i].id+0.1).style.display = "none";
		}
		document.getElementById(event.target.id/1 + 0.1).style.display="";
		
	},
	DeleteGame: function(event){
		if(window.confirm("Are you sure?")){
			var item_id=event.target.id;
			var url = "/api/games/"+(this.state.collection.length-1);
			var c=0;
			var index
			this.state.collection.map(function(item){
				c++;
				if(item.id==item_id){
					index=c-1; 
				}
			});

			result=this.state.collection;

			for(var i in result){
				if(result[i].id==result.length-1){
					result[i].id=result[index].id;
					result[index]=result[i];
					result.splice(i,1);
					break;
				}
			}
			
			var temp=[this.state.view,this.state.sort];
				  this.replaceState({
				  	collection:result,
				  	view:temp[0],
				  	sort:temp[1]
				  });
			
				$.ajax({
					  type: "PUT",
					  url: "/api/games",
					  data: this.state.collection[index],
					  success: function(result) {
				        // Do something with the result
				    	},
					  dataType: JSON
				});
			
				$.ajax({
				    url: url,
				    type: 'DELETE',
				    success: function(result) {
				        // Do something with the result
				    }
				});
		}
	},
	EditGame: function(event){
		if((this.state.view==2)||(event.target.id!=this.state.view - 10)){
			this.setState({view:10+event.target.id/1});
		}else{
			this.setState({view:2});
		}
	},
	UpdateGame: function(event){
		var url="/api/games/"+event.target.id;
			result = this.state.collection;
			for(var i in result){
				if(result[i].id==event.target.id){
					if(document.getElementById("ename"+event.target.id).value!=""){
						result[i].name=document.getElementById("ename"+event.target.id).value;
					}
					if(document.getElementById("eplatform"+event.target.id).value!=""){
						result[i].platform=document.getElementById("eplatform"+event.target.id).value;
					}
					if(document.getElementById("egenre"+event.target.id).value!=""){
						result[i].genre=document.getElementById("egenre"+event.target.id).value;
					}
					if(document.getElementById("erating"+event.target.id).value!=""){
						result[i].rating=document.getElementById("erating"+event.target.id).value;
					}
					if(document.getElementById("edescription"+event.target.id).value!=""){
						result[i].description=document.getElementById("edescription"+event.target.id).value;
					}
				}
			}
			var temp=[this.state.view, this.state.sort];
				  this.replaceState({
				  	collection:result,
				  	view:temp[0],
				  	sort:temp[1]
				  });
			$.ajax({
				  type: "PUT",
				  url: url,
				  data: result[event.target.id],
				  success: function(result) {
			        // Do something with the result
			    	},
				  dataType: JSON
				});

	},
	AddGame: function(event){
		if(document.getElementById("name").value!=""){
			result = this.state.collection;
			var newItem = {
				name: document.getElementById("name").value,
				platform : document.getElementById("platform").value,
				genre : document.getElementById("genre").value,
				rating : document.getElementById("rating").value,
				id: this.state.collection.length,
				description : document.getElementById("description").value
			};
			
			result.push(newItem);
			var temp=[this.state.view,this.state.sort];
				  this.replaceState({
				  	collection:result,
				  	view:temp[0],
				  	sort:temp[1]
				  });
			
			$.ajax({
				  type: "POST",
				  url: "/api/games",
				  data: newItem,
				  success: function(result) {
			        // Do something with the result
			    	},
				  dataType: JSON
				});

		} else {
			alert("Game must have name");
		}

	},
	SortName: function(event){
		
		result = this.state.collection;
		if(this.state.sort[0]>0){
			result.sort(function(a, b) {			
				return a.name.localeCompare(b.name);	
			});
		} else{
			result.sort(function(b, a) {			
				return a.name.localeCompare(b.name);	
			});
		}
		var newSort = [this.state.sort[0]*(-1),this.state.sort[1]];
		this.setState({collection:result,sort:newSort});
	},
	SortPlatform: function(event){
		
		result = this.state.collection;
		if(this.state.sort[1]>0){
			result.sort(function(a, b) {			
				return a.platform.localeCompare(b.platform);	
			});
		} else{
			result.sort(function(b, a) {			
				return a.platform.localeCompare(b.platform);	
			});
		}
		
		var newSort = [this.state.sort[0],this.state.sort[1]*(-1)];
		this.setState({collection:result,sort:newSort});
	},
	componentDidMount: function() {
	  	
	    $.get("/api/games", function(result) {
            var data = result;
            if (this.isMounted()) {
              var temp=[this.state.view,this.state.sort];
			  this.replaceState({
			  	collection:result,
			  	view:temp[0],
			  	sort:temp[1]
			  });
            }
          }.bind(this));
        },
	render: function(){
		var fdisp="none";
		if(this.state.view==0){
			fdisp="none";
			var contentRows = this.state.collection.map(function(item){
				
				return (

					<tbody>
					<tr >
					   	<td>{item.name}</td>
					    <td>{item.platform}</td>
					</tr>
					</tbody>
					);
			}.bind(this));
		}else if(this.state.view == 1){
			fdisp="none";
			var first = 0;
			var contentRows = this.state.collection.map(function(item){
				var sdisp = ((first==0) ? "":"none");
				first=1;
				return (
					<tbody id={item.id} onClick={this.DisplayDetails}> 
						<tr  id={item.id} onClick={this.DisplayDetails}>
						   	<td id={item.id} onClick={this.DisplayDetails}>{item.name}</td>
						    <td id={item.id} onClick={this.DisplayDetails}>{item.platform}</td>
						</tr>
					<tr  id={item.id/1+0.1} style={{display:sdisp, background: "#DDD"}}>
					    <td colSpan="2"><p style={{"width":"90%"}}>
					    <strong>Name:</strong> {item.name} <br />
					    <strong>Platform:</strong> {item.platform} <br />
					    <strong>Genre:</strong> {item.genre} <br />
					    <strong>Rating:</strong> {item.rating} <br />
					    <strong>Description:</strong> <br />
					    {item.description}
					    </p></td>
					</tr>
					</tbody>
					);
			}.bind(this));
		} else if(this.state.view == 2){
			fdisp= "";
			var contentRows = this.state.collection.map(function(item){
				
				return (

					<tbody>
					<tr >
					   	<td>{item.name}</td>
					    <td>{item.platform}</td>
					    <td style={{"text-align": "right"}}>
					    	<button id={item.id} type="button" className="btn btn-danger" onClick={this.DeleteGame}>Delete</button>
							&nbsp;
							<button id={item.id} type="button" className="btn btn-warning" onClick={this.EditGame}>Edit</button>
					    </td>
					    
					</tr>
					</tbody>
					)
			}.bind(this));
		} else {
			fdisp= "";
			
			var contentRows = this.state.collection.map(function(item){
				var sdisp = (((this.state.view-10)==item.id) ? "":"none");
				
				var form={
					name: "ename"+item.id,
					platform: "eplatform"+item.id,
					genre: "egenre"+item.id,
					rating: "erating"+item.id,
					description: "edescription"+item.id
				};
				return (

					<tbody>
					<tr >
					   	<td>{item.name}</td>
					    <td>{item.platform}</td>
					    <td style={{"text-align": "right"}}>
					    	<button id={item.id} type="button" className="btn btn-danger" onClick={this.DeleteGame}>Delete</button>
							&nbsp;
							<button id={item.id} type="button" className="btn btn-warning" onClick={this.EditGame}>Edit</button>
					    </td>
					</tr>
					<tr  style={{display:sdisp, background: "#DDD"}}>
					    <td colSpan="2"><p style={{"width":"90%"}}>
						    <strong>Name:</strong> {item.name} <br />
						    <strong>Platform:</strong> {item.platform} <br />
						    <strong>Genre:</strong> {item.genre} <br />
						    <strong>Rating:</strong> {item.rating} <br />
						    <strong>Description:</strong> <br />
						    {item.description}
					    </p></td>
					</tr>
					<tr  style={{display:sdisp}}>
					    <td colSpan="2">
					    <div className="form-inline" style={{display:fdisp}}>
				              <div className="form-group">
				                <input className="form-control" 
				                       type="text" 
				                       id={form.name}
				                       placeholder="Name" 
				                       maxLength="30"/>
				              </div>
				              <div className="form-group">
				                <input className="form-control" 
				                       type="text" 
				                       id={form.platform}
				                       placeholder="Platform" 
				                       maxLength="10"/>
				              </div>
				              <div className="form-group">
				              <input className="form-control" 
				                     type="text" 
				                     id={form.genre}
				                     placeholder="Genre" 
				                     maxLength="16"/>
				              </div>
				              <div className="form-group">
				              <input className="form-control" 
				                     type="number" 
				                     id={form.rating}
				                     placeholder="rating" min="0" max="5" />
				              </div>
				              <div className="form-group">
				              <input className="form-control" 
				                     type="text" 
				                     id={form.description}
				                     placeholder="Description" />
				              </div>
				         </div></td>
				         <td style={{"text-align": "right"}}>
				         	<button id={item.id} className="btn btn-primary" onClick={this.UpdateGame}>Submit</button>
				         </td>
					</tr>

					</tbody>
					)
			}.bind(this));
		}
		var tableview = (
					<div>
					<br />
						<div className="form-inline" style={{display:fdisp}}>
				              <div className="form-group">
				                <input className="form-control" 
				                       type="text" 
				                       id="name" 
				                       placeholder="Name" 
				                       maxLength="30"/>
				              </div>
				              <div className="form-group">
				                <input className="form-control" 
				                       type="text" 
				                       id="platform" 
				                       placeholder="Platform" 
				                       maxLength="10"/>
				              </div>
				              <div className="form-group">
				              <input className="form-control" 
				                     type="text" 
				                     id="genre" 
				                     placeholder="Genre" 
				                     maxLength="16"/>
				              </div>
				              <div className="form-group">
				              <input className="form-control" 
				                     type="number" 
				                     id="rating" 
				                     placeholder="rating" min="0" max="5" />
				              </div>
				              <div className="form-group">
				              <input className="form-control" 
				                     type="text" 
				                     id="description" 
				                     placeholder="Description" />
				              </div>
				              
				              

				              <button id="AddGameButton" className="btn btn-primary" onClick={this.AddGame}>Add Game</button>
				         </div>
						<table className="table">
						 	<thead>							
							 <tr>
							 	<th>Name &nbsp;&nbsp;<button 
							 							type="button"
							 							className="btn btn-xs btn-default" 
							 							title="Sort by Name"
							 							onClick={this.SortName}>
	 							 	<span className="glyphicon glyphicon-sort"></span></button>
								</th>
							 	<th>Platform &nbsp;&nbsp;<button 
							 								type="button" 
							 								className="btn btn-xs btn-default" 
							 								title="Sort by Platform"
							 								onClick={this.SortPlatform}>
 							 		<span className="glyphicon glyphicon-sort"></span></button>
							 	</th>
							 </tr>
							</thead>
							
							{contentRows}
													
						</table>
					</div>
			);

			return (
				<div>
					<div className="btn-group" role="group" aria-label="...">
						<button type="button" className="btn btn-default" onClick={this.ListView}>List View</button>
						<button type="button" className="btn btn-default" onClick={this.DetailView}>Detail View</button>
						<button type="button" className="btn btn-default" onClick={this.EditView}>Edit</button>
					</div>
					{tableview}
				</div> 
			);
			
	}
});

React.render(<Table />,mountNode);

