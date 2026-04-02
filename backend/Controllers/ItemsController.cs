using Backend.Data;
using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ItemsController : ControllerBase
{
    private readonly AppDbContext _db;

    public ItemsController(AppDbContext db)
    {
        _db = db;
    }

    // GET api/items
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var items = await _db.Items.ToListAsync();
        return Ok(items);
    }

    // GET api/items/5
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var item = await _db.Items.FindAsync(id);
        if (item is null) return NotFound();
        return Ok(item);
    }

    // POST api/items
    [HttpPost]
    public async Task<IActionResult> Create(Item item)
    {
        _db.Items.Add(item);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = item.Id }, item);
    }

    // PUT api/items/5
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, Item item)
    {
        if (id != item.Id) return BadRequest();

        _db.Entry(item).State = EntityState.Modified;

        try
        {
            await _db.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!await _db.Items.AnyAsync(i => i.Id == id)) return NotFound();
            throw;
        }

        return NoContent();
    }

    // DELETE api/items/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var item = await _db.Items.FindAsync(id);
        if (item is null) return NotFound();

        _db.Items.Remove(item);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}
