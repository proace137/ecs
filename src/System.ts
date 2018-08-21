import { Entity } from "./Entity";
import { ECS } from "./ECS";

export abstract class System{
    
    protected _ecs: ECS | null;
    public enable: boolean;
    protected entities: Map<string, Entity>;

    constructor(){
        this._ecs = null;
        this.entities = new Map<string,Entity>();
        this.enable = true;
    }

    set ecs(ecs: ECS){
        if(this._ecs == null)
            this._ecs = ecs;
    }

    public addEntity(entity: Entity){
        if(!this.entities.has(entity.id)){
            this.entities.set(entity.id,entity);
            entity.addSystem(this);

            this.enter(entity);
        }
    }

    public removeEntity(entity: Entity){
        if(this.entities.has(entity.id)){
            entity.removeSystem(this);
            this.exit(entity);
        }
    }

    public dispose(){
        this.entities.forEach((entity: Entity, id: string) => {
            entity.removeSystem(this);
            this.exit(entity);
        })
    }

    abstract init(): void;
    abstract test(entity: Entity): boolean;
    abstract enter(entity: Entity): void;
    abstract exit(entity: Entity): void;
    abstract update(entity: Entity, elapsedTime: number): void;

}