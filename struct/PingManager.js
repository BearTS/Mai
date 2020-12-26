const fetch = require('node-fetch');

module.exports = class PingManager{
  constructor(client, monitorPings = {}){

    /**
     * The client that instantiated this Manager
     * @name PingManager#client
     * @type {MaiClient}
     * @readonly
     */
    Object.defineProperty(this, 'client', { value: client })

    /**
     * Whether the manager is ready to give data
     * @type {boolean}
     */
    this.available = true;

    /**
     * Time when the ping were last updated
     * @type {date}
     */
    this.lastUpdatedAt = new Date();

    if (!Array.isArray(monitorPings.requests)){
      monitorPings.requests = [];
    };

    if (typeof monitorPings.timeout !== 'Number'){
      /**
       * The timeout between fetching ping
       * @type {boolean}
       */
      this.timeout = 300000;
    } else {
      if (monitorPings.timeout < 300000){
        this.timeout = 300000;
      } else {
        //Do nothing..
      };
    };

    /**
     * The handlers for the ping the client manages
     * @type {boolean}
     */
    this.handlers = [
      {
        name: 'discord', registry: 'Client Heartbeat',
        description: 'DAPI (Discord Application Programming Interface) client ping that determines the delay between the incoming and outgoing of data within discord.',
        handler: undefined, options: undefined, type: 'getter'
      },{
        name: 'message', registry: 'Msg Roundtrip',
        description: 'DAPI (Discord Application Programming Interface) message latency displays the difference of time in milliseconds between receiving and sending of messages within discord',
        handler: undefined, options: undefined, type: undefined
      }
    ];

    for (const request of monitorPings.requests){
      if (typeof request.name !== 'string'){
        continue;
      };

      if (typeof request.url !== 'string' && !(request.function instanceof Promise)){
        continue;
      };

      const handler = request.url || request.function;
      const type = typeof request.url === 'string' ? 'request' : 'function';
      const options = typeof request.options === 'object' ? request.options : undefined;
      const registry = typeof request.registerAs === 'string' ? request.registerAs : request.name;
      const description = typeof request.description === 'string' ? request.description : null;

      this[request.name] = null;
      this.handlers.push({ name: request.name, registry, description, handler, options, type });
    };

    // Automatically loop ping requests every PingManager#timeout seconds
    if (this.handlers.length - 2){
      this.loop(() => {
        const now = Date.now();
        Promise.all(this.handlers.map(x => {
          if (x.type === 'request'){
            return fetch(x.handler, x.options).then((res)=>{
              return Date.now() - now;
            }).catch(() => null);
          } else if (x.handler){
            return x.handler.then(()=>{
              return Date.now() - now;
            }).catch(() => null);
          } else {
            return;
          };
        })).then( res => {
          this.handlers.forEach((x, i) => {
            if ([ 'discord', 'message' ].includes(x.name)){
              return;
            };
            this[x.name] = res[i];
          });
          this.lastUpdatedAt = new Date();
        })
      }, this.timeout);
    } else {
      this.available = false
    };
  };

  loop(fn, delay){
    fn();
    return setInterval(fn, delay);
  };

  get discord(){
    return this.client.ws.ping
  };
};
