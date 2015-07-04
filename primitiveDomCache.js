/* 		
		A dom cache to speed up document.getElementBYId

		This program is free software: you can redistribute it and/or modify
		it under the terms of the GNU General Public License as published by
		the Free Software Foundation, either version 3 of the License, or
		(at your option) any later version.

		This program is distributed in the hope that it will be useful,
		but WITHOUT ANY WARRANTY; without even the implied warranty of
		MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
		GNU General Public License for more details.

		You should have received a copy of the GNU General Public License
		along with this program (if you are reading this on the original
		author's website, you can find a copy at
		<https://googledrive.com/host/0BwflTm9l-5_0fnFvVzI2TW1hU3J6TGc2NEt6VFc4N0hzaWpGX082LWY2aDJTSV85aVRxYVU/license.txt>). If not, see
		<http://www.gnu.org/licenses/>. */
// primitive element caching
// While I recommend using jQuery for this kind of thing, this should improve performance a little.

var domCache = {
	nodes : {},
	observer:new MutationObserver(
		function(mutations)
		{
			mutations.forEach(
				function(mutation)
				{
					for(var i in mutation.removedNodes)
					{
						var node = mutation.removedNodes[i];
						if(node.id && domCache.nodes[node.id])
						{
							delete(domCache.nodes[node.id]);
						}
					}
				}
			);
		}
	),
	observerOptions:{subtree:false, childList:true},
	getElementById:function(id)
	{
		if(!id)
		{
			console.log('Request for element served but no id given');
			console.log(new Error().stack);
			return null;
		}
		if(this.nodes[id])
		{
			return this.nodes[id];
		}
		var consoleMessages = [];
		consoleMessages.push('searching for element ' +id);
		var elem = document.getElementById(id);
		
		if(elem === null)
		{
			consoleMessages.push('Element '+id+' not found');
			console.log(consoleMessages);
			return null;
		}
		
		this.observer.observe(elem.parentNode, this.observerOptions);
		
		this.nodes[id] = elem;
		return elem;
	}
};