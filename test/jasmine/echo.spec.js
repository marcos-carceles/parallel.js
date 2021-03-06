describe("Initialisation", function() {

  beforeEach(function(){
   this.addMatchers({
     toBeA: function(expected) { return this.env.equals_(this.actual, jasmine.any(expected)); }
   });
 });

  it("requires a Firebase reference", function() {
    expect(Echo.init()).toBe(false);
    expect(Echo.init(false)).toBe(false);
    expect(Echo.init("")).toBe(false);
    expect(Echo.init("invalid")).toBe(false);
    expect(Echo.init("https://something.firebaseio-demo.com/")).toBe(true);
    expect(Echo.init("https://something.firebaseio.com/more/")).toBe(true);
  });
});

// describe("DOM Manipulation", function() {
//   it("can create a selector for a specific node", function() {
    
//     var parent = document.createElement("DIV");
//     parent.classList.add("parent");
//     parent.classList.add("node");
//     parent.id = "parent-id";
//     var child = document.createElement("SPAN");
//     child.className = "child node";
//     child.id = "child-id";
//     parent.appendChild(child);
//     document.body.appendChild(parent);
    
//     var docChild = document.querySelector("span.child");
    
//     expect(docChild).not.toBeNull();
    
//     expect(Echo.selector(child)).toBe("div#parent-id.parent.node span#child-id.child.node");
//   });
// });

describe("Echo Event Management", function() {

  var Handler = function(){},
      element = null;

  beforeEach(function(){
    document.body.innerHTML = '';
    Handler.handle = function(arg){}
    spyOn(Handler, "handle");
    Handler.onclick = function(arg){};
    spyOn(Handler, "onclick");
    element = document.createElement("DIV");
    element.id = 'unique';
    element.addEventListener("click", Handler.onclick);
    document.body.appendChild(element);
  });
  
  it("Can handle an Event", function() {
    Echo.chain(Handler.handle);
    expect(Handler.handle).not.toHaveBeenCalled();

    var eventObj = document.createEvent('HTMLEvents');
    eventObj.initEvent('click', true, true);
    element.dispatchEvent(eventObj);
    expect(Handler.handle).toHaveBeenCalled();
  });

  it("can trigger events on an element", function() {
    expect(Handler.onclick).not.toHaveBeenCalled();
    Echo.trigger(element,"click");
    expect(Handler.onclick).toHaveBeenCalled();
  });

  it("can trigger events based on a selector", function() {
    expect(Handler.onclick).not.toHaveBeenCalled();
    Echo.trigger('div#unique',"click");
    expect(Handler.onclick).toHaveBeenCalled();
  });

  it("Events triggered bu Echo are not processed by it", function() {
    expect(Handler.onclick).not.toHaveBeenCalled();
    Echo.chain(Handler.handle);
    Echo.trigger('div#unique','click');
    expect(Handler.onclick.calls.length).toBe(1);
    expect(Handler.handle.calls.length).toBe(0);
  });
});
